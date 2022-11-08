from ..models import Post, post_serializer, Photo
from django.http.response import (
    JsonResponse,
    HttpResponse,
)
from .utils import HttpStatus
import json
from rest_framework.parsers import MultiPartParser, JSONParser, FileUploadParser
from rest_framework.decorators import api_view, parser_classes
from PIL import Image
from django.db import transaction


@api_view(['GET', "PUT", "DELETE"])
@parser_classes([MultiPartParser, JSONParser, FileUploadParser])
def post_id(request, pid=0):
    if request.method == "GET":
        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return HttpResponse(status=HttpStatus.NOT_FOUND)

        info_response = post_serializer(post)
        return JsonResponse(info_response, safe=False)

    elif request.method == 'PUT':

        # try:
        #     # TODO: use parser from django-rest-framework
        #     request_data = json.loads(request.body.decode())
        # except Exception as e:
        #     return HttpResponse(status=HttpStatus.BAD_REQUEST)

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
        # try:
        #     # TODO: use parser from django-rest-framework
        #     request_data = json.loads(request.body.decode())
        # except Exception as e:
        #     return HttpResponse(status=HttpStatus.BAD_REQUEST)

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


@api_view(['GET', "POST"])
@parser_classes([MultiPartParser])
def posts(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        response_list = []
        for post in post_list.iterator():
            response = post_serializer(post)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    elif request.method == "POST":

        # validate uploaded data
        try:
            photos = request.data.pop("photos")
            content_json = request.data.pop("content")

            if len(request.data) != 0:
                raise Exception("Invalid data")

            if len(content_json) != 1:
                raise Exception("Invalid Data")

            for photo in photos:
                img = Image.open(photo)
                img.verify()

            content_dict = json.loads(content_json[0])
            content = {
                "animal_type": content_dict["animal_type"],
                "age": content_dict["age"],
                "name": content_dict["name"],
                "gender": content_dict["gender"],
                "title": content_dict["title"],
                "is_active": content_dict["is_active"],
                "species": content_dict["species"],
                "neutering": content_dict["neutering"],
                "vaccination": content_dict["vaccination"],
                "content": {
                    "text": content_dict["text"],
                }
            }

        except Exception as e:
            print(e)
            return HttpResponse(status=HttpStatus.BAD_REQUEST)
        if not request.user.is_authenticated:
            return HttpResponse(status=HttpStatus.UNAUTHORIZED)

        try:
            with transaction.atomic():
                post = Post.objects.create(
                    author=request.user,
                    **content
                )
                photo_list = []
                for photo in photos:
                    image = Photo.objects.create(
                        user=request.user,
                        category='post',
                        number=post.id,
                        image=photo
                    )
                    photo_list.append(image.id)

                post.content["photo_list"] = photo_list
                post.save()
        except Exception as e:
            return HttpResponse(status=HttpStatus.INTERNAL_SERVER_ERROR)

        return HttpResponse(status=HttpStatus.CREATED)

    else:
        return HttpResponse(status=HttpStatus.NOT_ALLOWED)
