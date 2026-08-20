from rest_framework import serializers

from .models import Package, Service


class ServiceSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Service
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "prices",
            "category",
            "category_label",
            "short_label",
        )


class PackageSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    logistics_upgrade = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "price_complex",
            "payment_terms",
            "payment_badges",
            "is_featured",
            "services",
            "logistics_upgrade",
        )

    def get_logistics_upgrade(self, obj):
        if obj.price_complex is None:
            return 0
        return obj.price_complex - obj.price
