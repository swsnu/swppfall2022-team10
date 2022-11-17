from ..models import Review, review_serializer, ReviewImage
from .utils import verify_image, verify_json, log_error

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

logger = logging.getLogger("review_view")


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify_image(["POST"])
@verify_json(["POST"])
@log_error(logger)
def reviews(request):
    if request.method == "GET":

        response_list = []
        review_list = Review.objects.all().order_by("-created_at")
        for review in review_list.iterator():
            response = review_serializer(review)
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
                "title": content_dict["title"],
                "content": content_dict["content"],
            }
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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
