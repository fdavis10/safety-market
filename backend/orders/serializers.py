from rest_framework import serializers

from catalog.models import Service
from .models import CartItem, Order


class CartItemSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source="service.name", read_only=True)
    price = serializers.DecimalField(source="service.price", max_digits=12, decimal_places=2, read_only=True)
    line_total = serializers.SerializerMethodField()
    category = serializers.CharField(source="service.category", read_only=True)

    class Meta:
        model = CartItem
        fields = ("id", "service", "service_name", "quantity", "price", "line_total", "category")

    def get_line_total(self, obj):
        return obj.line_total


class CartWriteSerializer(serializers.Serializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.filter(is_active=True))
    quantity = serializers.IntegerField(min_value=1, default=1)


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
