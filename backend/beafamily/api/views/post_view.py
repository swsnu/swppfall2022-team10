import logging

from django.db import transaction
from django.urls import reverse
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import FileUploadParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from ..models import Post, PostImage
from ..serializers import PostSerializer, PostQueryValidator, PostValidator
from .utils import log_error, pagination, verify

logger = logging.getLogger("view_logger")


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
# @verify(PostValidator, PostQueryValidator)
@log_error(logger)
def post_id(request, pid=0):
    try:
        post = Post.objects.get(id=pid)
    except Post.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":

        info_response = PostSerializer(post, context={"user": request.user}).data

        return Response(info_response)

    elif request.method == "PUT":

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_200_OK)

    else:

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify(PostValidator, PostQueryValidator)
@log_error(logger)
def posts(request):
    if request.method == "GET":
        post_list = Post.objects.prefetch_related("photo_path", "comments")
        query = request.query

        date = query.get("date")
        date_min, date_max = query.get("date_min"), query.get("date_max")
        if date is not None:
            post_list = post_list.filter(created_at__date=date)
        elif date_min is not None:
            post_list = post_list.filter(created_at__date__range=[date_min, date_max])

        age = query.get("age")
        age_min, age_max = query.get("age_min"), query.get("age_max")
        if age is not None:
            post_list = post_list.filter(age=age)
        elif age_min is not None:
            post_list = post_list.filter(age__range=[age_min, age_max])

        is_active = query.get("is_active")
        if is_active is not None:
            post_list = post_list.filter(is_active=is_active)

        gender = query.get("gender")
        if gender is not None:
            post_list = post_list.filter(gender=gender)

        animal_type = query.get("animal_type")
        if animal_type:
            post_list = post_list.filter(animal_type=animal_type)

        species = query.get("species")
        if query.get("species"):
            post_list = post_list.filter(species=species)

        api_url = reverse(posts)
        response = pagination(request, post_list, api_url, PostSerializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        query = request.parsed
        photos = request.data.pop("photos")

        with transaction.atomic():
            post = Post.objects.create(author=request.user, is_active=True, **query)
            for photo in photos:
                image = PostImage.objects.create(
                    author=request.user, post=post, image=photo
                )

        return Response(status=status.HTTP_201_CREATED, data=PostSerializer(post).data)
