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
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from ..models import Review, ReviewImage, review_serializer
from ..serializers import ReviewSerializer, ReviewQueryValidator, ReviewValidator
from .utils import log_error, pagination, verify

logger = logging.getLogger("review_view")


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify(ReviewValidator, ReviewQueryValidator)
@log_error(logger)
def reviews(request):
    if request.method == "GET":
        review_list = Review.objects.all().order_by("-created_at")

        api_url = reverse(reviews)
        response = pagination(request, review_list, api_url, ReviewSerializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        content = request.data.get("parsed")
        photos = request.data.pop("photos")

        with transaction.atomic():
            review = Review.objects.create(author=request.user, **content)
            for photo in photos:
                image = ReviewImage.objects.create(
                    author=request.user,
                    review=review,
                    image=photo,
                )

        return Response(
            status=status.HTTP_201_CREATED, data=ReviewSerializer(review).data
        )


@api_view(["GET"])
def review_id(request, rid: int):
    try:
        review = Review.objects.get(id=rid)
    except Review.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # response = review_serializer(review)
    response = ReviewSerializer(review)
    return Response(response.data)
