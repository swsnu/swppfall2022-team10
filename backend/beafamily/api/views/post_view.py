from ..models import Post, post_serializer
from django.http.response import (
    JsonResponse,
    HttpResponse,
)
from .utils import HttpStatus
import json


def post_id(request, pid=0):
    if request.method == "GET":
        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return HttpResponse(status=HttpStatus.NOT_FOUND)

        info_response = post_serializer(post)
        return JsonResponse(info_response, safe=False)

    elif request.method == 'PUT':

        try:
            # TODO: use parser from django-rest-framework
            request_data = json.loads(request.body.decode())
        except Exception as e:
            return HttpResponse(status=HttpStatus.BAD_REQUEST)

        if not request.user.is_authenticated:
            return HttpResponse(status=HttpStatus.UNAUTHORIZED)

        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return HttpResponse(status=HttpStatus.NOT_FOUND)

        if post.author != request.user:
            return HttpResponse(status=HttpStatus.FORBIDDEN)

        # TODO: edit post

        return HttpResponse(status=HttpStatus.OK)

    elif request.method == 'DELETE':
        try:
            # TODO: use parser from django-rest-framework
            request_data = json.loads(request.body.decode())
        except Exception as e:
            return HttpResponse(status=HttpStatus.BAD_REQUEST)

        if not request.user.is_authenticated:
            return HttpResponse(status=HttpStatus.UNAUTHORIZED)

        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return HttpResponse(status=HttpStatus.NOT_FOUND)

        if post.author != request.user:
            return HttpResponse(status=HttpStatus.FORBIDDEN)

        post.delete()
        return HttpResponse(status=HttpStatus.OK)

    else:
        return HttpResponse(status=HttpStatus.NOT_ALLOWED)


def posts(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        response_list = []
        for post in post_list.iterator():
            response = post_serializer(post)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    elif request.method == "POST":
        try:
            # TODO: use parser from django-rest-framework
            request_data = json.loads(request.body.decode())
        except Exception as e:
            return HttpResponse(status=HttpStatus.BAD_REQUEST)
        if not request.user.is_authenticated:
            return HttpResponse(status=HttpStatus.UNAUTHORIZED)

        # TODO: Create post, handle uploaded images

        return HttpResponse(status=HttpStatus.CREATED)

    else:
        return HttpResponse(status=HttpStatus.NOT_ALLOWED)
