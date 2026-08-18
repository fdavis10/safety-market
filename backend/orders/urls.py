from django.urls import path

from .views import CartItemView, CartView, CheckoutView, OrderDetailView, PackageCartView

urlpatterns = [
    path("cart/", CartView.as_view()),
    path("cart/items/<int:pk>/", CartItemView.as_view()),
    path("cart/packages/<int:pk>/", PackageCartView.as_view()),
    path("orders/", CheckoutView.as_view()),
    path("orders/<int:pk>/", OrderDetailView.as_view()),
]
