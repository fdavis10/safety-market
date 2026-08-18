from pathlib import Path

from django.conf import settings
from django.http import FileResponse, Http404


def spa(request, path=""):
    root = Path(settings.FRONTEND_DIR).resolve()
    if not root.is_dir():
        raise Http404()

    if path:
        candidate = (root / path).resolve()
        try:
            candidate.relative_to(root)
        except ValueError as exc:
            raise Http404() from exc
        if candidate.is_file():
            response = FileResponse(candidate.open("rb"))
            if path.replace("\\", "/").startswith("assets/"):
                response["Cache-Control"] = "public, max-age=31536000, immutable"
            return response

    index = root / "index.html"
    if not index.is_file():
        raise Http404()
    response = FileResponse(index.open("rb"), content_type="text/html; charset=utf-8")
    response["Cache-Control"] = "no-cache"
    return response
