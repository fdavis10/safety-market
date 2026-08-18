from django.contrib import admin

from .models import CartItem, Order, OrderItem, TelegramAdmin


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("name", "quantity", "price")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "session_key", "service", "quantity")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "citizenship", "total", "payment_method", "status", "created_at")
    list_filter = ("status", "payment_method")
    inlines = [OrderItemInline]
    readonly_fields = ("card_last4", "card_brand")


@admin.register(TelegramAdmin)
class TelegramAdminAdmin(admin.ModelAdmin):
    list_display = ("chat_id", "username", "first_name", "authorized_at")
