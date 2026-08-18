# Р ПЛЮС — кадровое агентство

Сайт международного подбора персонала: каталог услуг, пакеты под ключ, корзина и оплата только картой. Индексация поисковыми системами отключена.

## Запуск

Нужны Python 3.12+ и Node.js 20+.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
cd backend
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

В другом терминале:

```powershell
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173

Админка Django: http://127.0.0.1:8000/admin/

## Постановка на сервер (Docker + Postgres)

На хосте нужны Docker Engine и плагин Compose v2. Сайт слушает порт 80, API и React отдаются одним контейнером, данные — в Postgres.

```bash
git clone <URL-репозитория> safety-market
cd safety-market
cp .env.example .env
```

В `.env` задайте `SECRET_KEY`, `POSTGRES_PASSWORD`, `PUBLIC_URL` (адрес, с которого открывают сайт, например `http://203.0.113.10` или `https://recruit.example.com`), пароль админки и при необходимости `TELEGRAM_BOT_TOKEN`.

```bash
docker compose up -d --build
```

Сайт: `http://IP-сервера/`  
Админка: `http://IP-сервера/admin/`  
Логи: `docker compose logs -f web bot`

Обновление после `git pull`:

```bash
docker compose up -d --build
```

Данные Postgres хранятся в томе `postgres_data` и при пересборке контейнеров не пропадают.

## Тестовая карта

- Номер: `4111111111111111`
- Срок: любой будущий месяц в формате `MM/YY`
- CVV: любые 3 цифры

Полный номер и CVV не сохраняются: в заказе остаются платёжная система и последние 4 цифры.

## Telegram-бот

В третьем терминале:

```powershell
cd backend
python manage.py runbot
```

В Telegram откройте бота и отправьте `/start passwordkey`. Без пароля бот молчит. После входа придут уведомления о новых заказах (без полного номера карты и без CVV).

## Что внутри

- Django REST API: услуги, пакеты, корзина, заказ с обязательным гражданством
- React: главная, каталог, пакеты, корзина, оформление, правила и оферта
- `robots.txt`, meta robots и заголовок `X-Robots-Tag: noindex`
