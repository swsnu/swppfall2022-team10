import enum
from functools import wraps
from rest_framework import status
from rest_framework.response import Response
from PIL import Image


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
