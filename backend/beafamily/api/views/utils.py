from functools import wraps
from rest_framework import status
from rest_framework.response import Response
from rest_framework.parsers import (
    BaseParser,
    JSONParser,
    MultiPartParser,
    ParseError,
    MultiPartParserError,
)
from PIL import Image
from ..models import post_serializer

from django.core.paginator import Paginator
import json

writable_methods = ["POST", "PUT"]


def get_required_keys_and_types(view, method):
    key_type_set = dict()

    if view == "post":
        if method in writable_methods:
            key_type_set["animal_type"] = str
            key_type_set["age"] = int
            key_type_set["name"] = str
            key_type_set["gender"] = bool
            key_type_set["title"] = str
            key_type_set["species"] = str
            key_type_set["neutering"] = bool
            key_type_set["vaccination"] = bool
            key_type_set["content"] = str
        elif method == "GET":
            key_type_set["animal_type"] = str
            key_type_set["date"] = int
            key_type_set["date_min"] = int
            key_type_set["date_max"] = int
            key_type_set["species"] = str
            key_type_set["age"] = int
            key_type_set["age_min"] = int
            key_type_set["age_max"] = int
            key_type_set["gender"] = bool
            key_type_set["is_active"] = bool
    elif view == "review":
        if method in writable_methods:
            key_type_set["title"] = str
            key_type_set["content"] = str

    return key_type_set


def verify(view):
    def decorator(func):
        @wraps(func)
        def verified_view(request, *args, **kwargs):
            key_type_set = get_required_keys_and_types(view, request.method)
            data_set = dict()
            if request.method in writable_methods:

                if "photos" not in request.data:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                photos = request.data.getlist("photos")

                try:
                    for photo in photos:
                        img = Image.open(photo)
                        img.verify()
                except:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                if "content" not in request.data:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                content_json = request.data.getlist("content")

                if len(content_json) != 1:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                content_json = json.loads(content_json[0])

                for key, required_type in key_type_set.items():
                    if (
                        key not in content_json
                        or type(content_json[key]) != required_type
                    ):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                    data_set[key] = content_json[key]

                request.data.setlist("parsed", [data_set])

            elif request.method == "GET":
                content_json = request.GET

                for key, required_type in key_type_set.items():
                    if key in content_json and content_json.get(key):
                        val = content_json.get(key)
                        if required_type == int:
                            try:
                                n = int(val)
                                if n < 0:
                                    raise ValueError()
                            except:
                                return Response(status=status.HTTP_400_BAD_REQUEST)
                        elif required_type == bool:
                            if val not in ["True", "False"]:
                                return Response(status=status.HTTP_400_BAD_REQUEST)

                for int_var in ["age", "date"]:
                    min_in = f"{int_var}_min" in content_json
                    max_in = f"{int_var}_max" in content_json

                    if min_in ^ max_in:
                        return Response(status=status.HTTP_400_BAD_REQUEST)

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
    page_size = request.GET.get("page_size")

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

    page_num = request.GET.get("page")
    page = paginator.get_page(page_num)

    response_list = []
    for post in page.object_list:
        response = serializer(post)
        response_list.append(response)

    response = {
        "results": response_list,
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
