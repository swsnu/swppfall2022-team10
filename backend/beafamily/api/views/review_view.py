import json
import logging

# from PIL import Image
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
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from ..models import Review, ReviewImage, Post, Application
from ..serializers import (
    ReviewDetailSerializer,
    ReviewQueryValidator,
    ReviewValidator,
    ReviewListSerializer,
    PostSerializer,
)
from .utils import log_error, pagination, verify

logger = logging.getLogger("view_logger")


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify(ReviewValidator, ReviewQueryValidator)
@log_error(logger)
def reviews(request):
    if request.method == "GET":
        review_list = Review.objects.all()
        query = request.query

        animal_type = query.get("animal_type")
        if animal_type:
            review_list = review_list.filter(animal_type=animal_type)

        api_url = reverse(reviews)
        response = pagination(request, review_list, api_url, ReviewListSerializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        content = request.parsed
        photos = request.data.pop("photos")
        post_id = request.data.getlist("post_id")[0]

        try:
            post = Post.objects.get(id=post_id)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not post.accepted_application:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if post.accepted_application.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        with transaction.atomic():
            review = Review.objects.create(author=request.user, post=post, **content)
            thumbnail = None
            for photo in photos:
                image = ReviewImage.objects.create(
                    author=request.user,
                    review=review,
                    image=photo,
                )
                if thumbnail is None:
                    thumbnail = image

            review.thumbnail = thumbnail.image
            review.save()

        return Response(
            status=status.HTTP_201_CREATED, data=ReviewDetailSerializer(review).data
        )


@api_view(["GET", "DELETE"])
def review_id(request, rid: int):
    try:
        review = Review.objects.get(id=rid)
    except Review.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        response = ReviewDetailSerializer(review)
        return Response(response.data)
    else:
        if request.user != review.author:
            return Response(status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def review_check(request):
    p = Post.objects.filter(accepted_application__author=request.user).filter(
        review_post=None
    )
    response = PostSerializer(p, many=True).data

    return Response(status=status.HTTP_200_OK, data=response)
