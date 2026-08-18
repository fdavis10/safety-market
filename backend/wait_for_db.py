"""Ждёт, пока PostgreSQL примет соединения."""

import os
import sys
import time


def main():
    host = os.environ.get("POSTGRES_HOST")
    if not host:
        return

    import psycopg

    deadline = time.time() + int(os.environ.get("POSTGRES_WAIT_SECONDS", "60"))
    params = {
        "dbname": os.environ.get("POSTGRES_DB", "recruit"),
        "user": os.environ.get("POSTGRES_USER", "recruit"),
        "password": os.environ.get("POSTGRES_PASSWORD", ""),
        "host": host,
        "port": os.environ.get("POSTGRES_PORT", "5432"),
        "connect_timeout": 3,
    }
    last_error = None
    while time.time() < deadline:
        try:
            with psycopg.connect(**params) as conn:
                conn.execute("SELECT 1")
            print("PostgreSQL готов", flush=True)
            return
        except Exception as exc:
            last_error = exc
            print(f"Жду PostgreSQL... {exc}", flush=True)
            time.sleep(1)
    print(f"PostgreSQL недоступен: {last_error}", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()
