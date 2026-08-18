"""Проверка карты без сохранения полного номера и CVV."""

from datetime import date
import re


def detect_brand(number: str) -> str:
    if number.startswith(("2200", "2201", "2202", "2203", "2204")):
        return "Мир"
    if number.startswith("4"):
        return "Visa"
    if number[:2] in {str(n) for n in range(51, 56)}:
        return "Mastercard"
    if number.startswith(("34", "37")):
        return "American Express"
    if number.startswith("2"):
        return "Мир"
    return "Карта"


def charge_card(payload: dict) -> dict:
    number = re.sub(r"\D", "", payload.get("card_number", ""))
    holder = (payload.get("card_holder") or "").strip()
    expiry = (payload.get("card_expiry") or "").strip()
    cvv = re.sub(r"\D", "", payload.get("card_cvv", ""))

    if len(number) < 13 or len(number) > 19:
        raise ValueError("Введите номер карты полностью (13–19 цифр).")
    if len(holder) < 3:
        raise ValueError("Укажите имя держателя карты.")
    if not re.fullmatch(r"(0[1-9]|1[0-2])\s*/\s*\d{2}", expiry):
        raise ValueError("Срок действия карты укажите в формате ММ/ГГ.")

    month, year = [part.strip() for part in expiry.split("/")]
    year_full = 2000 + int(year)
    month_i = int(month)
    today = date.today()
    if year_full < today.year or (year_full == today.year and month_i < today.month):
        raise ValueError("Срок действия карты истёк.")

    if len(cvv) not in (3, 4):
        raise ValueError("Проверьте CVV-код.")

    return {
        "ok": True,
        "brand": detect_brand(number),
        "last4": number[-4:],
    }
