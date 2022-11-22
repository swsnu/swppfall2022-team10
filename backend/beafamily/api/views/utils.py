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
            key_type_set["date"] = list
            key_type_set["species"] = str
            key_type_set["age"] = list
            key_type_set["gender"] = bool
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
                content_json = request.data

                for key, required_type in key_type_set.items():
                    if key in content_json and (
                        content_json[key] and type(content_json[key]) != required_type
                    ):
                        return Response(status=status.HTTP_400_BAD_REQUEST)
                    elif key in content_json:
                        if required_type == list:
                            try:
                                a, b = map(int, content_json[key])
                                if a > b:
                                    raise ValueError()
                            except:
                                return Response(status=status.HTTP_400_BAD_REQUEST)
                        data_set[key] = content_json[key]
                    else:
                        data_set[key] = None
                request.data["parsed"] = data_set

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
