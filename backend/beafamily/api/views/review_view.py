from ..models import Review, review_serializer, ReviewImage
from .utils import verify, log_error, pagination

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

# from PIL import Image
from django.db import transaction

import json
import logging
from django.urls import reverse

logger = logging.getLogger("review_view")


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser, JSONParser])
@verify("review")
@log_error(logger)
def reviews(request):
    content = request.data.get("parsed")
    if request.method == "GET":
        review_list = Review.objects.all().order_by("-created_at")

        api_url = reverse(reviews)
        response = pagination(request, review_list, api_url, review_serializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        photos = request.data.pop("photos")

        with transaction.atomic():
            review = Review.objects.create(author=request.user, **content)
            for photo in photos:
                image = ReviewImage.objects.create(
                    author=request.user,
                    review=review,
                    image=photo,
                )

        return Response(status=status.HTTP_201_CREATED, data=review_serializer(review))


@api_view(["GET"])
def review_id(request, rid: int):
    try:
        review = Review.objects.get(id=rid)
    except Review.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    response = review_serializer(review)
    return Response(response)
