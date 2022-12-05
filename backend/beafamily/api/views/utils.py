import json
import logging
from functools import wraps

from django.core.paginator import Paginator
from PIL import Image
from rest_framework import status
from rest_framework.parsers import (
    BaseParser,
    JSONParser,
    MultiPartParser,
    MultiPartParserError,
    ParseError,
)
from rest_framework.response import Response

from ..serializers import ImageValidator

writable_methods = ["POST", "PUT"]

logger = logging.getLogger("view_logger")


def verify_signup(validator):

    def decorator(func):
        @wraps(func)
        def verified_view(request, *args, **kwargs):

            return func(request, *args, **kwargs)

        return verified_view

    return decorator


def verify(validator, query_validator, has_image=True):
    def decorator(func):
        @wraps(func)
        def verified_view(request, *args, **kwargs):
            if request.method in writable_methods:

                # check existence
                if has_image and ("photos" not in request.data):
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                if "content" not in request.data:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                content_json = request.data.getlist("content")

                # check existence of extras
                if len(content_json) != 1:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                content_json = json.loads(content_json[0])

                if "photos" in request.data:
                    photos = request.data.getlist("photos")
                    photos = [{"image": p} for p in photos]

                    photos_validator = ImageValidator(data=photos, many=True)
                    if not photos_validator.is_valid():
                        return Response(status=status.HTTP_400_BAD_REQUEST)

                post_validator = validator(data=content_json)
                if not post_validator.is_valid():
                    print("HERE")
                    print(post_validator.data)
                    print(post_validator.errors)
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                request.parsed = post_validator.data

            elif request.method == "GET":
                query = request.GET
                qv = query_validator(data=query)

                if not qv.is_valid():
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                request.query = qv.data

            return func(request, *args, **kwargs)

        return verified_view

    return decorator


def log_error(logger):
    def decorator(func):
        @wraps(func)
        def error_handler(request, *args, **kwargs):
            try:
                ret = func(request, *args, **kwargs)

            except Exception as e:
                logger.error(f"{e}")
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return ret

        return error_handler

    return decorator


def pagination(request, data_list, api_url, serializer):
    page_size = request.query.get("page_size")

    if page_size:
        try:
            page_size = int(page_size)

            if page_size <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return None
    else:
        page_size = 20

    paginator = Paginator(data_list, page_size)

    page_num = request.query.get("page")
    page = paginator.get_page(page_num)

    results = serializer(page.object_list, many=True).data

    response = {
        "results": results,
        "count": paginator.count,
        "page_num": paginator.num_pages,
    }

    if page.has_next():
        if request.GET.get("page_size"):
            response[
                "next"
            ] = f"{api_url}?page={page.next_page_number()}?page_size={page_size}"
        else:
            response["next"] = f"{api_url}?page={page.next_page_number()}"
    else:
        response["next"] = None

    if page.has_previous():
        if request.GET.get("page_size"):
            response[
                "previous"
            ] = f"{api_url}?page={page.previous_page_number()}?page_size={page_size}"
        else:
            response["previous"] = f"{api_url}?page={page.previous_page_number()}"
    else:
        response["previous"] = None

    return response
