from decimal import Decimal

from django.db import models


class Service(models.Model):
    class Category(models.TextChoices):
        DOCS = "docs", "Документы, визы и гарантии"
        LOGISTICS = "logistics", "Международная логистика"
        ADAPTATION = "adaptation", "Сопровождение и адаптация в РФ"

    name = models.CharField("название", max_length=200)
    slug = models.SlugField("слаг", unique=True, allow_unicode=True)
    description = models.TextField("описание")
    price = models.DecimalField("стоимость", max_digits=12, decimal_places=2)
    # {"50": 35000, "90": 25000, "post": 50000}
    prices = models.JSONField("цены по типу оплаты", default=dict, blank=True)
    category = models.CharField("категория", max_length=32, choices=Category.choices)
    short_label = models.CharField("краткий ярлык", max_length=80, blank=True)
    is_active = models.BooleanField("активна", default=True)
    sort_order = models.PositiveIntegerField("порядок", default=0)

    class Meta:
        verbose_name = "услуга"
        verbose_name_plural = "услуги"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.name

    def price_for(self, payment_type="50"):
        raw = (self.prices or {}).get(payment_type)
        if raw is not None:
            return Decimal(str(raw))
        return self.price


class Package(models.Model):
    name = models.CharField("название", max_length=200)
    slug = models.SlugField("слаг", unique=True, allow_unicode=True)
    description = models.TextField("описание")
    price = models.DecimalField("стоимость (стандартный маршрут)", max_digits=12, decimal_places=2)
    price_complex = models.DecimalField(
        "стоимость (сложный маршрут)",
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
    )
    payment_terms = models.TextField("условия оплаты")
    payment_badges = models.JSONField("ярлыки оплаты", default=list, blank=True)
    services = models.ManyToManyField(Service, related_name="packages", verbose_name="услуги")
    is_featured = models.BooleanField("акцентный", default=False)
    sort_order = models.PositiveIntegerField("порядок", default=0)

    class Meta:
        verbose_name = "пакет"
        verbose_name_plural = "пакеты"
        ordering = ["sort_order", "id"]

    def __str__(self):
        return self.name

    def price_for_route(self, route="standard"):
        if route == "multimodal" and self.price_complex is not None:
            return self.price_complex
        return self.price
