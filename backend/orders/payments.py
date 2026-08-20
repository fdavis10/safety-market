"""Клиент платёжного шлюза Сбера (register + статус)."""

from __future__ import annotations

import logging
import warnings
from decimal import Decimal
from typing import Any

import requests
from django.conf import settings
from urllib3.exceptions import InsecureRequestWarning

logger = logging.getLogger(__name__)

# orderStatus: 0=registered, 1=pre-authorized, 2=deposited/paid, 3=reversed, 4=refunded, 5=ACS, 6=declined
PAID_ORDER_STATUSES = {2}
PAID_PAYMENT_STATES = {"DEPOSITED", "APPROVED"}


class SberPaymentError(Exception):
    def __init__(self, message: str, *, error_code: str | None = None, payload: dict | None = None):
        super().__init__(message)
        self.error_code = error_code
        self.payload = payload or {}


def _credentials() -> tuple[str, str]:
    username = (settings.SBER_USERNAME or "").strip()
    password = (settings.SBER_PASSWORD or "").strip()
    if not username or not password:
        raise SberPaymentError("Не заданы SBER_USERNAME / SBER_PASSWORD.")
    return username, password


def _post(path: str, body: dict[str, Any]) -> dict[str, Any]:
    username, password = _credentials()
    url = f"{settings.SBER_API_BASE.rstrip('/')}/{path.lstrip('/')}"
    payload = {
        "userName": username,
        "password": password,
        **body,
    }
    # ecomtest + часто прокси/НУЦ Минцифры → self-signed в цепочке на Windows
    verify = bool(getattr(settings, "SBER_VERIFY_SSL", True))
    if "ecomtest" in settings.SBER_API_BASE.lower():
        verify = False

    try:
        with warnings.catch_warnings():
            if not verify:
                warnings.simplefilter("ignore", InsecureRequestWarning)
            response = requests.post(
                url,
                json=payload,
                timeout=30,
                headers={"Content-Type": "application/json"},
                verify=verify,
            )
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as exc:
        logger.exception("Sber API request failed: %s", path)
        raise SberPaymentError(f"Ошибка связи с платёжным шлюзом: {exc}") from exc
    except ValueError as exc:
        raise SberPaymentError("Некорректный ответ платёжного шлюза.") from exc

    error_code = str(data.get("errorCode", "0"))
    if error_code != "0":
        message = data.get("errorMessage") or data.get("error") or "Ошибка платёжного шлюза."
        raise SberPaymentError(str(message), error_code=error_code, payload=data)
    return data


def amount_to_kopecks(amount: Decimal | int | float | str) -> int:
    value = Decimal(str(amount)).quantize(Decimal("0.01"))
    return int(value * 100)


def register_order(
    *,
    amount_kopecks: int,
    order_number: str,
    return_url: str,
    fail_url: str,
    description: str = "",
) -> dict[str, Any]:
    """Регистрация заказа в Сбере. Возвращает orderId и formUrl."""
    if amount_kopecks < 1:
        raise SberPaymentError("Сумма оплаты должна быть больше нуля.")
    data = _post(
        "register.do",
        {
            "orderNumber": order_number,
            "amount": amount_kopecks,
            "currency": "643",
            "returnUrl": return_url,
            "failUrl": fail_url,
            "description": (description or "")[:512],
        },
    )
    order_id = data.get("orderId") or data.get("order_id")
    form_url = data.get("formUrl") or data.get("form_url")
    if not order_id or not form_url:
        raise SberPaymentError("Шлюз не вернул orderId/formUrl.", payload=data)
    return {
        "order_id": str(order_id),
        "form_url": str(form_url),
        "raw": data,
    }


def get_order_status(sber_order_id: str) -> dict[str, Any]:
    """Расширенный статус заказа в Сбере."""
    if not sber_order_id:
        raise SberPaymentError("Не указан sber_order_id.")
    data = _post(
        "getOrderStatusExtended.do",
        {"orderId": sber_order_id},
    )
    order_status = data.get("orderStatus")
    try:
        order_status_int = int(order_status) if order_status is not None else None
    except (TypeError, ValueError):
        order_status_int = None

    payment_info = data.get("paymentAmountInfo") or {}
    payment_state = str(payment_info.get("paymentState") or "").upper()

    card_auth = data.get("cardAuthInfo") or {}
    pan = str(card_auth.get("pan") or "")
    last4 = pan[-4:] if len(pan) >= 4 else ""
    brand = str(card_auth.get("paymentSystem") or card_auth.get("cardholderName") or "")[:32]

    is_paid = order_status_int in PAID_ORDER_STATUSES or payment_state in PAID_PAYMENT_STATES
    is_failed = order_status_int == 6 or payment_state in {"DECLINED", "REVERSED"}

    return {
        "order_status": order_status_int,
        "payment_state": payment_state,
        "is_paid": is_paid,
        "is_failed": is_failed and not is_paid,
        "card_last4": last4,
        "card_brand": brand,
        "raw": data,
    }
