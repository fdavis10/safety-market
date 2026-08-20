from rest_framework import serializers

from catalog.models import Service
from .models import CartItem, Order


class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    kind = serializers.SerializerMethodField()
    service = serializers.PrimaryKeyRelatedField(read_only=True)
    package = serializers.PrimaryKeyRelatedField(read_only=True)
    price = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "kind",
            "service",
            "package",
            "item_name",
            "quantity",
            "price",
            "line_total",
            "category",
            "logistics_route",
            "payment_type",
        )

    def get_item_name(self, obj):
        return obj.title

    def get_kind(self, obj):
        return "package" if obj.package_id else "service"

    def get_price(self, obj):
        return obj.unit_price

    def get_category(self, obj):
        return "package" if obj.package_id else obj.service.category

    def get_line_total(self, obj):
        return obj.line_total


class CartWriteSerializer(serializers.Serializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.filter(is_active=True))
    quantity = serializers.IntegerField(min_value=1, default=1)
    payment_type = serializers.ChoiceField(choices=["50", "90", "post"], default="50")


class CheckoutSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32)
    citizenship = serializers.CharField(max_length=120, required=True, allow_blank=False)
    comment = serializers.CharField(required=False, allow_blank=True, default="")
    offer_accepted = serializers.BooleanField()
    payment_method = serializers.ChoiceField(choices=["card"])
    card_number = serializers.CharField(write_only=True)
    card_holder = serializers.CharField(write_only=True)
    card_expiry = serializers.CharField(write_only=True)
    card_cvv = serializers.CharField(write_only=True)

    def validate_citizenship(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Укажите гражданство кандидата или заказчика.")
        return value

    def validate_offer_accepted(self, value):
        if not value:
            raise serializers.ValidationError("Необходимо принять условия оферты.")
        return value

    def validate_payment_method(self, value):
        if value != "card":
            raise serializers.ValidationError("Оплата принимается только банковской картой.")
        return value


class OrderItemSerializer(serializers.Serializer):
    name = serializers.CharField()
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=12, decimal_places=2)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "citizenship",
            "total",
            "payment_method",
            "card_last4",
            "card_brand",
            "status",
            "created_at",
            "items",
        )
