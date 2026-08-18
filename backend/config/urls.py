from pathlib import Path

from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response

from catalog.views import SiteInfoView
from config.spa import spa


@ensure_csrf_cookie
@api_view(["GET"])
def csrf_view(_request):
    return Response({"detail": "ok"})


def robots_txt(_request):
    return HttpResponse(
        "User-agent: *\nDisallow: /\n",
        content_type="text/plain; charset=utf-8",
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("robots.txt", robots_txt),
    path("api/csrf/", csrf_view),
    path("api/site/", SiteInfoView.as_view()),
    path("api/", include("catalog.urls")),
    path("api/", include("orders.urls")),
]

if (Path(settings.FRONTEND_DIR) / "index.html").is_file():
    urlpatterns.append(re_path(r"^(?P<path>.*)$", spa))
