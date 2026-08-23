from decimal import Decimal
import logging
import uuid

from django.conf import settings
from django.db import transaction
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Package, Service
from .models import CartItem, Order, OrderItem
from .payments import SberPaymentError, amount_to_kopecks, get_order_status, register_order
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


def package_service_conflict(items):
    """True if cart has both a package and standalone services already covered by it."""
    package_items = [item for item in items if item.package_id]
    service_items = [item for item in items if item.service_id]
    if not package_items or not service_items:
        return False

    covered_ids = set()
    logistics_ids = set(
        Service.objects.filter(
            slug__in=["logistics-standard", "logistics-multimodal"]
        ).values_list("id", flat=True)
    )
    for item in package_items:
        covered_ids.update(item.package.services.values_list("id", flat=True))
        covered_ids.update(logistics_ids)

    return any(item.service_id in covered_ids for item in service_items)


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
        items = list(cart_qs(request).select_related("service", "package").prefetch_related("package__services"))
        if not items:
            return Response({"detail": "Корзина пуста."}, status=400)

        if package_service_conflict(items):
            return Response(
                {
                    "detail": (
                        "Услуги уже входят в пакет. Уберите их из корзины, чтобы продолжить."
                    )
                },
                status=409,
            )

        total = sum((item.line_total for item in items), Decimal("0"))
        if total <= 0:
            return Response({"detail": "Сумма заказа должна быть больше нуля."}, status=400)

        data = serializer.validated_data
        user = request.user if request.user.is_authenticated else None
        public = settings.PUBLIC_URL.rstrip("/")

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
                status=Order.Status.PENDING,
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

            order_number = f"rp-{order.id}-{uuid.uuid4().hex[:8]}"
            return_url = f"{public}/order/{order.id}/pay"
            fail_url = f"{public}/order/{order.id}/pay?failed=1"
            try:
                registered = register_order(
                    amount_kopecks=amount_to_kopecks(total),
                    order_number=order_number,
                    return_url=return_url,
                    fail_url=fail_url,
                    description=f"Заказ №{order.id}",
                )
            except SberPaymentError as exc:
                order.status = Order.Status.FAILED
                order.save(update_fields=["status"])
                logging.getLogger(__name__).exception(
                    "Sber register failed for order %s", order.id
                )
                return Response({"detail": str(exc)}, status=502)

            order.sber_order_id = registered["order_id"]
            order.sber_order_number = order_number
            order.save(update_fields=["sber_order_id", "sber_order_number"])

        request.session["last_order_id"] = order.id
        return Response(
            {
                "id": order.id,
                "form_url": registered["form_url"],
                "total": order.total,
                "status": order.status,
            },
            status=201,
        )


class OrderConfirmView(APIView):
    def post(self, request, pk):
        order = Order.objects.filter(pk=pk).prefetch_related("items").first()
        if not order:
            return Response({"detail": "Заказ не найден."}, status=404)

        if order.status == Order.Status.PAID:
            return Response(OrderSerializer(order).data)

        if not order.sber_order_id:
            return Response({"detail": "У заказа нет платёжной сессии Сбера."}, status=400)

        try:
            status_info = get_order_status(order.sber_order_id)
        except SberPaymentError as exc:
            logging.getLogger(__name__).exception(
                "Sber status failed for order %s", order.id
            )
            return Response({"detail": str(exc)}, status=502)

        update_fields = []
        if status_info.get("card_last4") and not order.card_last4:
            order.card_last4 = status_info["card_last4"]
            update_fields.append("card_last4")
        if status_info.get("card_brand") and not order.card_brand:
            order.card_brand = status_info["card_brand"]
            update_fields.append("card_brand")

        if status_info["is_paid"]:
            was_unpaid = order.status != Order.Status.PAID
            order.status = Order.Status.PAID
            update_fields.append("status")
            order.save(update_fields=update_fields)
            if was_unpaid:
                try:
                    notify_new_order(order)
                except Exception:
                    logging.getLogger(__name__).exception(
                        "Telegram: заказ %s не отправлен", order.id
                    )
            return Response(OrderSerializer(order).data)

        if status_info["is_failed"]:
            order.status = Order.Status.FAILED
            update_fields.append("status")
            order.save(update_fields=update_fields)
            return Response(OrderSerializer(order).data)

        if update_fields:
            order.save(update_fields=update_fields)
        return Response(OrderSerializer(order).data)


class OrderDetailView(APIView):
    def get(self, request, pk):
        order = Order.objects.filter(pk=pk).prefetch_related("items").first()
        if not order:
            return Response({"detail": "Заказ не найден."}, status=404)
        return Response(OrderSerializer(order).data)
