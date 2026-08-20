from decimal import Decimal
import logging

from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Package, Service
from .models import CartItem, Order, OrderItem
from .payments import charge_card
from .telegram import notify_new_order
from .serializers import (
    CartItemSerializer,
    CartWriteSerializer,
    CheckoutSerializer,
    OrderSerializer,
)


def ensure_session(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def cart_qs(request):
    session_key = ensure_session(request)
    qs = CartItem.objects.filter(session_key=session_key).select_related("service", "package")
    if request.user.is_authenticated:
        qs = (CartItem.objects.filter(user=request.user).select_related("service", "package") | qs).distinct()
    return qs


def cart_payload(request):
    items = list(cart_qs(request))
    total = sum((item.line_total for item in items), Decimal("0"))
    return {
        "items": CartItemSerializer(items, many=True).data,
        "total": total,
        "count": sum(item.quantity for item in items),
    }


def payment_type_for_cart_item(item):
    if item.service_id:
        return item.payment_type or "50"
    terms = (item.package.payment_terms or "").lower()
    if "90" in terms:
        return "90"
    if "пост" in terms:
        return "post"
    return "50"


class CartView(APIView):
    def get(self, request):
        ensure_session(request)
        return Response(cart_payload(request))

    def post(self, request):
        serializer = CartWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        session_key = ensure_session(request)
        service = serializer.validated_data["service"]
        quantity = serializer.validated_data["quantity"]
        payment_type = serializer.validated_data.get("payment_type", "50")
        user = request.user if request.user.is_authenticated else None
        package_item = cart_qs(request).filter(package__services=service).first()
        if not package_item and service.slug in {"logistics-standard", "logistics-multimodal"}:
            package_item = cart_qs(request).filter(package__isnull=False).first()
        if package_item:
            return Response(
                {"detail": f"Услуга уже входит в пакет «{package_item.package.name}» в корзине."},
                status=409,
            )
        item, created = CartItem.objects.get_or_create(
            session_key=session_key,
            service=service,
            package=None,
            defaults={"quantity": quantity, "user": user, "payment_type": payment_type},
        )
        if not created:
            item.quantity += quantity
            item.payment_type = payment_type
            if user and not item.user:
                item.user = user
            item.save(update_fields=["quantity", "user", "payment_type"])
        return Response(cart_payload(request), status=201)

    def delete(self, request):
        cart_qs(request).delete()
        return Response(cart_payload(request))


class CartItemView(APIView):
    def patch(self, request, pk):
        item = cart_qs(request).filter(pk=pk).first()
        if not item:
            return Response({"detail": "Позиция не найдена."}, status=404)
        quantity = int(request.data.get("quantity", item.quantity))
        if quantity < 1:
            item.delete()
        else:
            item.quantity = quantity
            item.save(update_fields=["quantity"])
        return Response(cart_payload(request))

    def delete(self, request, pk):
        item = cart_qs(request).filter(pk=pk).first()
        if not item:
            return Response({"detail": "Позиция не найдена."}, status=404)
        item.delete()
        return Response(cart_payload(request))


class PackageCartView(APIView):
    def post(self, request, pk):
        package = Package.objects.prefetch_related("services").filter(pk=pk).first()
        if not package:
            return Response({"detail": "Пакет не найден."}, status=404)

        logistics_route = request.data.get("logistics_route", "standard")
        if logistics_route not in {"standard", "multimodal"}:
            return Response({"detail": "Некорректный тип маршрута."}, status=400)

        # Если в корзине уже есть отдельные услуги из этого пакета,
        # не позволяем добавить пакет и эти услуги вместе.
        service_ids = list(package.services.values_list("id", flat=True))
        logistics_ids = list(
            Service.objects.filter(slug__in=["logistics-standard", "logistics-multimodal"]).values_list("id", flat=True)
        )
        conflict_ids = set(service_ids) | set(logistics_ids)
        existing_service_item = cart_qs(request).filter(service_id__in=conflict_ids).first()
        if existing_service_item and existing_service_item.service_id:
            service_name = existing_service_item.service.name if existing_service_item.service else "Эта услуга"
            return Response(
                {"detail": f"Услуга «{service_name}» уже добавлена в корзину."},
                status=409,
            )
        session_key = ensure_session(request)
        user = request.user if request.user.is_authenticated else None
        item, created = CartItem.objects.get_or_create(
            session_key=session_key,
            package=package,
            service=None,
            defaults={"quantity": 1, "user": user, "logistics_route": logistics_route},
        )
        if not created:
            item.quantity += 1
            item.logistics_route = logistics_route
            if user and not item.user:
                item.user = user
            item.save(update_fields=["quantity", "user", "logistics_route"])
        return Response(cart_payload(request), status=201)


class CheckoutView(APIView):
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        items = list(cart_qs(request))
        if not items:
            return Response({"detail": "Корзина пуста."}, status=400)

        try:
            payment = charge_card(serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=400)

        total = sum((item.line_total for item in items), Decimal("0"))
        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None

        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                full_name=data["full_name"],
                email=data["email"],
                phone=data["phone"],
                citizenship=data["citizenship"],
                comment=data.get("comment") or "",
                total=total,
                payment_method="card",
                card_last4=payment["last4"],
                card_brand=payment["brand"],
                status=Order.Status.PAID,
                offer_accepted=True,
            )
            OrderItem.objects.bulk_create(
                [
                    OrderItem(
                        order=order,
                        service=service,
                        name=service.name,
                        quantity=item.quantity,
                        price=service.price_for(payment_type_for_cart_item(item)),
                    )
                    for item in items
                    for service in (
                        item.package_services_resolved() if item.package_id else [item.service]
                    )
                ]
            )
            CartItem.objects.filter(id__in=[item.id for item in items]).delete()

        order = Order.objects.prefetch_related("items").get(pk=order.id)
        try:
            notify_new_order(order)
        except Exception:
            logging.getLogger(__name__).exception("Telegram: заказ %s не отправлен", order.id)

        request.session["last_order_id"] = order.id
        return Response(OrderSerializer(order).data, status=201)


class OrderDetailView(APIView):
    def get(self, request, pk):
        order = Order.objects.filter(pk=pk).prefetch_related("items").first()
        if not order:
            return Response({"detail": "Заказ не найден."}, status=404)
        return Response(OrderSerializer(order).data)
