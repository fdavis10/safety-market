import secrets
import time

from django.conf import settings
from django.core.management.base import BaseCommand

from orders.models import TelegramAdmin
from orders.telegram import send_message, telegram_call

AUTH_OK = (
    "Вы авторизованы. Всё чётко.\n"
    "Новые заказы с сайта будут приходить в этот чат."
)


def command_parts(text):
    text = (text or "").strip()
    if not text:
        return "", ""
    first, *rest = text.split(maxsplit=1)
    return first.split("@", 1)[0], rest[0] if rest else ""


class Command(BaseCommand):
    help = "Telegram-бот админки заказов"

    def handle(self, *args, **options):
        if not settings.TELEGRAM_BOT_TOKEN:
            self.stderr.write("TELEGRAM_BOT_TOKEN не задан. Бот ждёт токен в .env.")
            while True:
                time.sleep(3600)
        password = settings.TELEGRAM_ADMIN_PASSWORD
        telegram_call("deleteWebhook", {"drop_pending_updates": False})
        telegram_call("setMyCommands", {"commands": []})
        offset = 0
        self.stdout.write("Бот запущен. Жду /start <пароль>.")
        self.stdout.flush()
        while True:
            try:
                payload = telegram_call(
                    "getUpdates",
                    {"offset": offset, "timeout": 25, "allowed_updates": ["message"]},
                    timeout=35,
                )
            except Exception as exc:
                self.stderr.write(str(exc))
                time.sleep(3)
                continue
            for update in payload.get("result") or []:
                offset = max(offset, int(update["update_id"]) + 1)
                message = update.get("message")
                if not message:
                    continue
                chat = message.get("chat") or {}
                chat_id = chat.get("id")
                if chat_id is None:
                    continue
                cmd, argument = command_parts(message.get("text"))
                if cmd != "/start" or not secrets.compare_digest(argument, password):
                    continue
                TelegramAdmin.objects.update_or_create(
                    chat_id=chat_id,
                    defaults={
                        "username": chat.get("username") or "",
                        "first_name": chat.get("first_name") or "",
                    },
                )
                try:
                    send_message(chat_id, AUTH_OK)
                except Exception as exc:
                    self.stderr.write(str(exc))
