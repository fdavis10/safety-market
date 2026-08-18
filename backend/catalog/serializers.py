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
            "category",
            "category_label",
            "short_label",
        )


class PackageSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "payment_terms",
            "payment_badges",
            "is_featured",
            "services",
        )
