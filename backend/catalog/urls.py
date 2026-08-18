from django.urls import path

from .views import CategoryListView, PackageListView, ServiceDetailView, ServiceListView

urlpatterns = [
    path("categories/", CategoryListView.as_view()),
    path("services/", ServiceListView.as_view()),
    path("services/<int:pk>/", ServiceDetailView.as_view()),
    path("packages/", PackageListView.as_view()),
]
