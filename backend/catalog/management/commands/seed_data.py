from django.core.management.base import BaseCommand

from catalog.models import Package, Service

SERVICES = [
    {
        "slug": "audit",
        "name": "Первичный аудит и допуск",
        "category": Service.Category.DOCS,
        "price": "18000.00",
        "short_label": "Документы",
        "sort_order": 1,
        "description": (
            "Проверяем комплект документов кандидата, соответствие вакансии и основания "
            "для въезда. По итогам выдаём допуск к следующему этапу или список замечаний."
        ),
    },
    {
        "slug": "notary",
        "name": "Нотариальные переводы и легализация",
        "category": Service.Category.DOCS,
        "price": "24500.00",
        "short_label": "Легализация",
        "sort_order": 2,
        "description": (
            "Организуем нотариальный перевод дипломов, трудовых и персональных документов, "
            "апостиль и консульскую легализацию под требования РФ."
        ),
    },
    {
        "slug": "visa",
        "name": "Визовое сопровождение и приглашение",
        "category": Service.Category.DOCS,
        "price": "62000.00",
        "short_label": "Виза",
        "sort_order": 3,
        "description": (
            "Готовим приглашение, пакет на рабочую или гуманитарную визу, сопровождаем "
            "подачу и отвечаем на запросы консульства до получения визы."
        ),
    },
    {
        "slug": "insurance",
        "name": "Страхование финансовых рисков",
        "category": Service.Category.DOCS,
        "price": "41000.00",
        "short_label": "Гарантии",
        "sort_order": 4,
        "description": (
            "Оформляем страховое покрытие на случай срыва выезда, отказа в визе по "
            "независящим от сторон причинам и финансовых обязательств работодателя."
        ),
    },
    {
        "slug": "logistics-standard",
        "name": "Логистика: стандартный маршрут",
        "category": Service.Category.LOGISTICS,
        "price": "89000.00",
        "short_label": "Перелёт",
        "sort_order": 5,
        "description": (
            "Прямой или стыковочный маршрут с покупкой билетов, трансфертом из аэропорта "
            "и контролем стыковок. Подходит для большинства стран выезда."
        ),
    },
    {
        "slug": "logistics-multimodal",
        "name": "Логистика: сложный мультимодальный маршрут",
        "category": Service.Category.LOGISTICS,
        "price": "168000.00",
        "short_label": "Мультимодально",
        "sort_order": 6,
        "description": (
            "Комбинация авиа, ж/д и автоучастков, когда прямых рейсов нет. Включает "
            "сопровождение на стыковках, багажный контроль и запасной план."
        ),
    },
    {
        "slug": "travel-kit",
        "name": "Путевое обеспечение",
        "category": Service.Category.LOGISTICS,
        "price": "27000.00",
        "short_label": "В пути",
        "sort_order": 7,
        "description": (
            "Набор на дорогу: страховка на время переезда, SIM с роумингом, инструкция "
            "по маршруту и контакты дежурного координатора."
        ),
    },
    {
        "slug": "welcome",
        "name": "Welcome-пакет: жилье и питание",
        "category": Service.Category.ADAPTATION,
        "price": "74000.00",
        "short_label": "Жильё",
        "sort_order": 8,
        "description": (
            "Бронируем жильё на период адаптации, организуем заселение и питание "
            "в первые недели, знакомим с районом и маршрутом до места работы."
        ),
    },
    {
        "slug": "legalization-rf",
        "name": "Легализация в РФ: миграция и медицина",
        "category": Service.Category.ADAPTATION,
        "price": "53000.00",
        "short_label": "Миграция",
        "sort_order": 9,
        "description": (
            "Миграционный учёт, патент или разрешение на работу, дактилоскопия, "
            "медкомиссия и полис ДМС — без самостоятельной очереди в ведомствах."
        ),
    },
    {
        "slug": "language",
        "name": "Профессиональная языковая адаптация",
        "category": Service.Category.ADAPTATION,
        "price": "36000.00",
        "short_label": "Язык",
        "sort_order": 10,
        "description": (
            "Интенсив русского языка под рабочую коммуникацию: техника безопасности, "
            "отчётность, диалоги с мастером и бытовые ситуации."
        ),
    },
    {
        "slug": "kit",
        "name": "Бытовая экипировка",
        "category": Service.Category.ADAPTATION,
        "price": "19500.00",
        "short_label": "Быт",
        "sort_order": 11,
        "description": (
            "Стартовый набор: сезонная одежда, средства гигиены, SIM российского оператора, "
            "транспортная карта и базовые вещи для общежития или квартиры."
        ),
    },
    {
        "slug": "concierge",
        "name": "Консьерж 24/7 и финансовая логистика",
        "category": Service.Category.ADAPTATION,
        "price": "58000.00",
        "short_label": "24/7",
        "sort_order": 12,
        "description": (
            "Круглосуточный координатор, помощь с зарплатной картой, переводами семье "
            "и решением бытовых вопросов в течение первого контрактного периода."
        ),
    },
]

PACKAGES = [
    {
        "slug": "entry",
        "name": "Пакет «Въезд»",
        "price": "98000.00",
        "is_featured": False,
        "sort_order": 1,
        "services": ["audit", "notary", "visa"],
        "payment_terms": (
            "Полная оплата картой до старта работ. Подходит, если логистику и жильё "
            "работодатель организует самостоятельно."
        ),
        "payment_badges": [
            {"label": "Только карта", "tone": "gold"},
            {"label": "100% предоплата", "tone": "navy"},
        ],
        "description": (
            "Документальный контур: аудит, легализация и визовое приглашение. "
            "Фиксируем статус кандидата до покупки билетов."
        ),
    },
    {
        "slug": "move",
        "name": "Пакет «Переезд»",
        "price": "246000.00",
        "is_featured": True,
        "sort_order": 2,
        "services": ["audit", "notary", "visa", "logistics-standard", "travel-kit", "welcome"],
        "payment_terms": (
            "Оплата картой двумя равными частями: 50% при заключении, 50% за 5 дней "
            "до вылета. Наличные и переводы не принимаются."
        ),
        "payment_badges": [
            {"label": "Только карта", "tone": "gold"},
            {"label": "2 платежа по 50%", "tone": "crimson"},
            {"label": "До вылета", "tone": "navy"},
        ],
        "description": (
            "Виза, стандартный маршрут и welcome-пакет. Кандидат приезжает с жильём "
            "на первые недели и понятным планом выхода на работу."
        ),
    },
    {
        "slug": "turnkey",
        "name": "VIP All-Inclusive",
        "price": "670000.00",
        "is_featured": False,
        "sort_order": 3,
        "services": [
            "audit",
            "notary",
            "visa",
            "insurance",
            "logistics-standard",
            "logistics-multimodal",
            "travel-kit",
            "welcome",
            "legalization-rf",
            "language",
            "kit",
            "concierge",
        ],
        "payment_terms": (
            "0$ до вылета. Компания берёт на себя 100% финансовых рисков и расходов. "
            "Полная стоимость пакета оплачивается только в конце и удерживается из будущей заработной платы."
        ),
        "payment_badges": [
            {"label": "Без авансов", "tone": "gold"},
            {"label": "Постоплата 100%", "tone": "crimson"},
            {"label": "0$ до вылета", "tone": "navy"},
        ],
        "description": (
            "Включены все 12 услуг каталога. Дополнительно покрываются сложная логистика, "
            "профессиональное языковое обучение, полная экипировка, переводы денег семье и личный куратор."
        ),
    },
]


class Command(BaseCommand):
    help = "Заполняет каталог услуг и пакеты"

    def handle(self, *args, **options):
        services = {}
        for payload in SERVICES:
            obj, _ = Service.objects.update_or_create(
                slug=payload["slug"],
                defaults={key: value for key, value in payload.items() if key != "slug"},
            )
            services[obj.slug] = obj

        for payload in PACKAGES:
            slugs = payload["services"]
            obj, _ = Package.objects.update_or_create(
                slug=payload["slug"],
                defaults={key: value for key, value in payload.items() if key not in {"slug", "services"}},
            )
            obj.services.set([services[slug] for slug in slugs])

        self.stdout.write(self.style.SUCCESS(f"Услуг: {Service.objects.count()}, пакетов: {Package.objects.count()}"))
