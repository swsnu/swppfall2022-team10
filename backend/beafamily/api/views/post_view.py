from ..models import Post, post_serializer, PostImage
from .utils import verify_image, verify_json, log_error
import json
from rest_framework.parsers import MultiPartParser, JSONParser, FileUploadParser
from rest_framework.decorators import (
    api_view,
    parser_classes,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import logging

logger = logging.getLogger("post_view")


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser, JSONParser, FileUploadParser])
def post_id(request, pid=0):
    if request.method == "GET":
        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

        info_response = post_serializer(post)
        return Response(info_response)

    elif request.method == "PUT":

        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # TODO: edit post

        return Response(status=status.HTTP_200_OK)

    else:

        try:
            post = Post.objects.get(id=pid)
        except Post.DoesNotExist as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify_image(["POST"])
@verify_json(["POST"])
@log_error(logger)
def posts(request):
    if request.method == "GET":
        post_list = Post.objects.all().order_by("-created_at")
        response_list = []
        for post in post_list.iterator():
            response = post_serializer(post)
            response_list.append(response)

        return Response(response_list)

    else:
        photos = request.data.pop("photos")
        content_json = request.data.pop("content")

        if len(request.data) != 0:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:

            content_dict = json.loads(content_json[0])
            content = {
                "animal_type": content_dict["animal_type"],
                "age": content_dict["age"],
                "name": content_dict["name"],
                "gender": content_dict["gender"],
                "title": content_dict["title"],
                "species": content_dict["species"],
                "neutering": content_dict["neutering"],
                "vaccination": content_dict["vaccination"],
                "content": content_dict["content"],
            }

        except KeyError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            post = Post.objects.create(author=request.user, is_active=True, **content)
            for photo in photos:
                image = PostImage.objects.create(
                    author=request.user, post=post, image=photo
                )

        return Response(status=status.HTTP_201_CREATED, data=post_serializer(post))
