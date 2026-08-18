#!/bin/sh
set -e

python wait_for_db.py

if [ "${RUN_MIGRATIONS:-0}" = "1" ]; then
  python manage.py migrate --noinput
  if [ "${SEED_DATA:-1}" = "1" ]; then
    python manage.py seed_data
  fi
  python manage.py collectstatic --noinput
  if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
    python manage.py createsuperuser --noinput || true
  fi
fi

if [ "$1" = "gunicorn" ]; then
  exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${WEB_CONCURRENCY:-3}" \
    --timeout 90 \
    --access-logfile - \
    --error-logfile -
fi

exec "$@"
