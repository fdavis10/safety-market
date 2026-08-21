from django.core.management.base import BaseCommand

from catalog.models import Package, Service


def pay(p50, p90, post):
    return {"50": p50, "90": p90, "post": post}


SERVICES = [
    {
        "slug": "audit",
        "name": "Первичный аудит и допуск",
        "category": Service.Category.DOCS,
        "price": "35000.00",
        "prices": pay(35000, 25000, 50000),
        "short_label": "Документы",
        "sort_order": 1,
        "description": (
            "Экспертиза паспорта, проверка по базам данных на отсутствие запрета на въезд в РФ, "
            "предварительная регистрация в электронных системах."
        ),
    },
    {
        "slug": "notary",
        "name": "Нотариальные переводы и легализация",
        "category": Service.Category.DOCS,
        "price": "35000.00",
        "prices": pay(35000, 25000, 50000),
        "short_label": "Легализация",
        "sort_order": 2,
        "description": (
            "Профессиональный перевод паспорта, документов об образовании, сертификатов и справок "
            "с родного языка кандидата на русский язык. Нотариальное заверение для предоставления "
            "в официальные государственные органы РФ."
        ),
    },
    {
        "slug": "visa",
        "name": "Визовое сопровождение и Приглашение",
        "category": Service.Category.DOCS,
        "price": "70000.00",
        "prices": pay(70000, 50000, 100000),
        "short_label": "Виза",
        "sort_order": 3,
        "description": (
            "Подготовка официального приглашения, оплата консульских сборов, персональное сопровождение "
            "при подаче документов в посольство РФ в вашей стране."
        ),
    },
    {
        "slug": "insurance",
        "name": "Страхование финансовых рисков",
        "category": Service.Category.DOCS,
        "price": "49000.00",
        "prices": pay(49000, 35000, 70000),
        "short_label": "Гарантии",
        "sort_order": 4,
        "description": (
            "Финансовая защита кандидата. Гарантия возврата авансовых платежей в случае непредвиденного "
            "отказа в выдаче визы консульством или непрохождения медицинской комиссии в РФ не по вине "
            "кандидата."
        ),
    },
    {
        "slug": "logistics-standard",
        "name": "Логистика: Стандартный маршрут (Прямой или 1 пересадка)",
        "category": Service.Category.LOGISTICS,
        "price": "140000.00",
        "prices": pay(140000, 100000, 200000),
        "short_label": "Перелёт",
        "sort_order": 5,
        "description": (
            "Покупка билетов на прямые авиарейсы или рейсы с одной комфортной пересадкой. "
            "Оптимально для стран с прямым сообщением."
        ),
    },
    {
        "slug": "logistics-multimodal",
        "name": "Логистика: Сложный мультимодальный маршрут",
        "category": Service.Category.LOGISTICS,
        "price": "280000.00",
        "prices": pay(280000, 200000, 400000),
        "short_label": "Мультимодально",
        "sort_order": 6,
        "description": (
            "Разработка тяжелых маршрутов (более 2-х пересадок). Комбинирование авиа, железнодорожного, "
            "водного и автомобильного транспорта. Включает оформление транзитных виз."
        ),
    },
    {
        "slug": "travel-kit",
        "name": "Путевое обеспечение",
        "category": Service.Category.LOGISTICS,
        "price": "70000.00",
        "prices": pay(70000, 50000, 100000),
        "short_label": "В пути",
        "sort_order": 7,
        "description": (
            "Оплата гостиниц при транзите, питание в пути, билеты на внутренний транспорт в транзитных "
            "зонах, карманные расходы (сигареты, связь)."
        ),
    },
    {
        "slug": "welcome",
        "name": "Приветственный-пакет: Жилье и Питание",
        "category": Service.Category.ADAPTATION,
        "price": "56000.00",
        "prices": pay(56000, 40000, 80000),
        "short_label": "Жильё",
        "sort_order": 8,
        "description": (
            "Встреча в аэропорту, трансфер. Заселение в комфортное жилье и полное продовольственное обеспечение "
            "(трехразовое питание или суточные) на период адаптации."
        ),
    },
    {
        "slug": "legalization-rf",
        "name": "Легализация в РФ: Миграция и Медицина",
        "category": Service.Category.ADAPTATION,
        "price": "70000.00",
        "prices": pay(70000, 50000, 100000),
        "short_label": "Миграция",
        "sort_order": 9,
        "description": (
            "Миграционный учет, оплата медкомиссии, дактилоскопия, подготовка базового пакета документов "
            "для легальной работы."
        ),
    },
    {
        "slug": "language",
        "name": "Профессиональная языковая адаптация",
        "category": Service.Category.ADAPTATION,
        "price": "35000.00",
        "prices": pay(35000, 25000, 50000),
        "short_label": "Язык",
        "sort_order": 10,
        "description": (
            "Экспресс-обучение необходимым основам русского языка. Освоение узкой рабочей терминологии и фраз "
            "для безопасного и эффективного выполнения должностных обязанностей на рабочем месте."
        ),
    },
    {
        "slug": "kit",
        "name": "Бытовые принадлежности и прочее",
        "category": Service.Category.ADAPTATION,
        "price": "35000.00",
        "prices": pay(35000, 25000, 50000),
        "short_label": "Быт",
        "sort_order": 11,
        "description": (
            "Покупка сезонной одежды, обуви, предметов гигиены. Выдача базового смартфона с оплаченной местной "
            "SIM-картой."
        ),
    },
    {
        "slug": "concierge",
        "name": "Консьерж 24/7 и финансовая логистика",
        "category": Service.Category.ADAPTATION,
        "price": "210000.00",
        "prices": pay(210000, 150000, 300000),
        "short_label": "24/7",
        "sort_order": 12,
        "description": (
            "Личный координатор со знанием вашего языка для решения бытовых и рабочих вопросов. Помощь в настройке "
            "легальных шлюзов для безопасной отправки заработанных денег семье на родину."
        ),
    },
    {
        "slug": "legal-social-support",
        "name": "Юридическая и социальная поддержка 1 год с момента прибытия",
        "category": Service.Category.ADAPTATION,
        "price": "385000.00",
        "prices": pay(385000, 275000, 550000),
        "short_label": "Поддержка",
        "sort_order": 13,
        "description": (
            "Помощь в решении юридических, социальных и административных вопросов, сопровождение при взаимодействии "
            "с государственными органами и организациями, а также консультационная поддержка на всех ключевых этапах адаптации."
        ),
    },
]

PACKAGE_SERVICES = [
    "audit",
    "notary",
    "visa",
    "insurance",
    "logistics-standard",
    "travel-kit",
    "welcome",
    "legalization-rf",
    "language",
    "kit",
    "concierge",
    "legal-social-support",
]

PACKAGES = [
    {
        "slug": "entry",
        "name": "VIP All-Inclusive",
        "price": "1190000.00",
        "price_complex": "1330000.00",
        "is_featured": False,
        "sort_order": 1,
        "services": PACKAGE_SERVICES,
        "payment_terms": "50% предоплаты",
        "payment_badges": [],
        "description": "Включены все услуги из каталога.",
    },
    {
        "slug": "move",
        "name": "VIP All-Inclusive",
        "price": "850000.00",
        "price_complex": "950000.00",
        "is_featured": False,
        "sort_order": 2,
        "services": PACKAGE_SERVICES,
        "payment_terms": "100% предоплаты",
        "payment_badges": [],
        "description": "Включены все услуги из каталога.",
    },
    {
        "slug": "turnkey",
        "name": "VIP All-Inclusive",
        "price": "1700000.00",
        "price_complex": "1900000.00",
        "is_featured": False,
        "sort_order": 3,
        "services": PACKAGE_SERVICES,
        "payment_terms": "Постоплата",
        "payment_badges": [],
        "description": "Включены все услуги из каталога.",
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
