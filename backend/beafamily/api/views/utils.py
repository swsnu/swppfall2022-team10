from functools import wraps
from rest_framework import status
from rest_framework.response import Response
from PIL import Image
from ..models import post_serializer

from django.core.paginator import Paginator


def verify_image(methods):
    def decorator(func):
        @wraps(func)
        def verified_func(request, *args, **kwargs):
            if request.method in methods:

                if "photos" not in request.data:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                photos = request.data.getlist("photos")

                try:
                    for photo in photos:
                        img = Image.open(photo)
                        img.verify()

                except:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            return func(request, *args, **kwargs)

        return verified_func

    return decorator


def verify_json(methods):
    def decorator(func):
        @wraps(func)
        def verified_func(request, *args, **kwargs):
            if request.method in methods:

                if "content" not in request.data:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                content_json = request.data.getlist("content")

                if len(content_json) != 1:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            return func(request, *args, **kwargs)

        return verified_func

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
