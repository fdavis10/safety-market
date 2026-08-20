from django.conf import settings
from django.db import models
from django.db.models import Q

from catalog.models import Package, Service


class CartItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="пользователь",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="cart_items",
    )
    session_key = models.CharField("ключ сессии", max_length=40, db_index=True)
    service = models.ForeignKey(
        Service,
        verbose_name="услуга",
        on_delete=models.CASCADE,
        related_name="cart_items",
        null=True,
        blank=True,
    )
    package = models.ForeignKey(
        Package,
        verbose_name="пакет",
        on_delete=models.CASCADE,
        related_name="cart_items",
        null=True,
        blank=True,
    )
    quantity = models.PositiveIntegerField("количество", default=1)
    logistics_route = models.CharField(
        "маршрут логистики",
        max_length=32,
        choices=[
            ("standard", "Стандартный маршрут"),
            ("multimodal", "Сложный маршрут"),
        ],
        default="standard",
        blank=True,
    )
    payment_type = models.CharField(
        "тип оплаты",
        max_length=16,
        choices=[
            ("50", "50% предоплата"),
            ("90", "90% предоплата"),
            ("post", "Постоплата"),
        ],
        default="50",
        blank=True,
    )

    class Meta:
        verbose_name = "позиция корзины"
        verbose_name_plural = "корзина"
        constraints = [
            models.UniqueConstraint(
                fields=["session_key", "service"],
                name="uniq_cart_session_service",
                condition=Q(service__isnull=False),
            ),
            models.UniqueConstraint(
                fields=["session_key", "package"],
                name="uniq_cart_session_package",
                condition=Q(package__isnull=False),
            ),
            models.CheckConstraint(
                condition=(
                    (Q(service__isnull=False) & Q(package__isnull=True))
                    | (Q(service__isnull=True) & Q(package__isnull=False))
                ),
                name="cart_item_exactly_one_target",
            )
        ]

    def __str__(self):
        return f"{self.title} × {self.quantity}"

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    @property
    def unit_price(self):
        if self.package_id:
            return self.package.price_for_route(self.logistics_route or "standard")
        payment = self.payment_type or "50"
        return self.service.price_for(payment)

    def package_services_resolved(self):
        if not self.package_id:
            return [self.service] if self.service_id else []
        services = list(self.package.services.filter(is_active=True))
        standard = Service.objects.filter(slug="logistics-standard", is_active=True).first()
        multimodal = Service.objects.filter(slug="logistics-multimodal", is_active=True).first()
        if self.logistics_route == "multimodal" and multimodal:
            services = [s for s in services if s.slug != "logistics-standard"]
            if not any(s.slug == "logistics-multimodal" for s in services):
                services.append(multimodal)
        elif standard:
            services = [s for s in services if s.slug != "logistics-multimodal"]
            if not any(s.slug == "logistics-standard" for s in services):
                services.append(standard)
        return services

    @property
    def title(self):
        if self.package_id:
            route = "Сложный маршрут" if self.logistics_route == "multimodal" else "Стандартный маршрут"
            return f"{self.package.name} · {route}"
        return self.service.name


class Order(models.Model):
    class Status(models.TextChoices):
        PAID = "paid", "Оплачен"
        FAILED = "failed", "Ошибка оплаты"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="пользователь",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders",
    )
    full_name = models.CharField("ФИО", max_length=200)
    email = models.EmailField("email")
    phone = models.CharField("телефон", max_length=32)
    citizenship = models.CharField("гражданство", max_length=120)
    comment = models.TextField("комментарий", blank=True)
    total = models.DecimalField("сумма", max_digits=12, decimal_places=2)
    payment_method = models.CharField("способ оплаты", max_length=16, default="card")
    card_last4 = models.CharField("последние 4 цифры карты", max_length=4, blank=True)
    card_brand = models.CharField("платёжная система", max_length=32, blank=True)
    status = models.CharField("статус", max_length=16, choices=Status.choices, default=Status.PAID)
    offer_accepted = models.BooleanField("оферта принята", default=False)
    created_at = models.DateTimeField("создан", auto_now_add=True)

    class Meta:
        verbose_name = "заказ"
        verbose_name_plural = "заказы"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Заказ №{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name="order_items")
    name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = "позиция заказа"
        verbose_name_plural = "позиции заказа"

    def __str__(self):
        return self.name


class TelegramAdmin(models.Model):
    chat_id = models.BigIntegerField("chat id", unique=True)
    username = models.CharField("username", max_length=128, blank=True)
    first_name = models.CharField("имя", max_length=128, blank=True)
    authorized_at = models.DateTimeField("авторизован", auto_now_add=True)

    class Meta:
        verbose_name = "админ Telegram"
        verbose_name_plural = "админы Telegram"

    def __str__(self):
        return self.username or str(self.chat_id)
