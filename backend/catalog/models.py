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


class Package(models.Model):
    name = models.CharField("название", max_length=200)
    slug = models.SlugField("слаг", unique=True, allow_unicode=True)
    description = models.TextField("описание")
    price = models.DecimalField("стоимость", max_digits=12, decimal_places=2)
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
