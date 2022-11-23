from ..models import Post, post_serializer, PostImage
from .utils import verify, log_error, pagination
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
from django.urls import reverse
import logging
from datetime import datetime, timedelta

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
@verify("post")
@log_error(logger)
def posts(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        content = request.GET

        today = datetime.today()

        if content.get("date"):
            day = int(content.get("date"))
            day = today - timedelta(days=day)
            post_list = post_list.filter(created_at__exact=day)

        elif content.get("date_min", None) and content.get("date_max", None):
            s, e = int(content.get("date_min")), int(content.get("date_max"))
            start = today - timedelta(days=e)
            end = today - timedelta(days=s)
            post_list = post_list.filter(created_at__range=[start, end])

        if content.get("age", None):
            age = int(content.get("age"))
            post_list = post_list.filter(age=age)
        elif content.get("age_min", None) and content.get("age_max", None):
            s, e = int(content.get("age_min")), int(content.get("age_max"))
            post_list = post_list.filter(age__range=[s, e])

        if content.get("is_active", None):
            is_active = content.get("is_active") == "True"
            post_list = post_list.filter(is_active=is_active)

        if content.get("gender", None):
            gender = content.get("gender") == "True"
            post_list = post_list.filter(gender=gender)

        if content.get("animal_type", None):
            post_list = post_list.filter(animal_type=content.get("animal_type"))

        if content.get("species", None):
            post_list = post_list.filter(species=content.get("species"))

        post_list = post_list.order_by("-created_at")
        api_url = reverse(posts)
        response = pagination(request, post_list, api_url, post_serializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        content = request.data.get("parsed")
        photos = request.data.pop("photos")

        with transaction.atomic():
            post = Post.objects.create(author=request.user, is_active=True, **content)
            for photo in photos:
                image = PostImage.objects.create(
                    author=request.user, post=post, image=photo
                )

        return Response(status=status.HTTP_201_CREATED, data=post_serializer(post))
