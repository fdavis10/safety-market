import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

from .models import TelegramAdmin

logger = logging.getLogger(__name__)

API = "https://api.telegram.org/bot{token}/{method}"


def _html(value):
    return (
        str(value or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def telegram_call(method, payload=None, timeout=60):
    token = settings.TELEGRAM_BOT_TOKEN
    if not token:
        raise RuntimeError("TELEGRAM_BOT_TOKEN не задан")
    url = API.format(token=token, method=method)
    data = json.dumps(payload or {}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        logger.warning("Telegram %s failed: %s %s", method, exc.code, body)
        raise


def send_message(chat_id, text):
    return telegram_call(
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        },
    )


def format_order(order):
    items = "\n".join(
        f"• {_html(item.name)} × {item.quantity} — {item.price:,.0f} ₽".replace(",", " ")
        for item in order.items.all()
    )
    comment = f"\n💬 {_html(order.comment)}" if order.comment else ""
    brand = _html(order.card_brand or "Карта")
    last4 = _html(order.card_last4 or "----")
    total = f"{order.total:,.0f}".replace(",", " ")
    return (
        f"<b>Новый заказ №{order.id}</b>\n\n"
        f"👤 {_html(order.full_name)}\n"
        f"📧 {_html(order.email)}\n"
        f"📱 {_html(order.phone)}\n"
        f"🌍 Гражданство: {_html(order.citizenship)}"
        f"{comment}\n\n"
        f"<b>Состав</b>\n{items}\n\n"
        f"💰 Итого: <b>{total} ₽</b>\n\n"
        f"<b>Оплата</b>\n"
        f"Карта {brand} •••• {last4}"
    )


def notify_new_order(order):
    if not settings.TELEGRAM_BOT_TOKEN:
        return
    text = format_order(order)
    for admin in TelegramAdmin.objects.all():
        try:
            send_message(admin.chat_id, text)
        except Exception:
            logger.exception("Не удалось отправить заказ %s в chat %s", order.id, admin.chat_id)
