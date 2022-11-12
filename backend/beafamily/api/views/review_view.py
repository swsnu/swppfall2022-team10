from ..models import Review, review_serializer, Photo
from django.http.response import (
    JsonResponse,
    HttpResponse
)
from .utils import HttpStatus

from rest_framework.parsers import MultiPartParser, JSONParser, FileUploadParser
from rest_framework.decorators import api_view, parser_classes, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication
from PIL import Image
from django.db import transaction

import json


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
def reviews(request):
    if request.method == "GET":

        response_list = []
        review_list = Review.objects.all().order_by('-datetime')
        for review in review_list.iterator():
            response = review_serializer(review)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    # elif request.method == "POST":
    else:
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
                "title": content_dict["title"],
                "content": {
                    "text": content_dict["content"]
                }
            }
        except Exception as e:
            return HttpResponse(status=HttpStatus.BAD_REQUEST)

        try:
            with transaction.atomic():
                review = Review.objects.create(
                    author=request.user,
                    **content
                )
                photo_list = []
                for photo in photos:
                    image = Photo.objects.create(
                        user=request.user,
                        category='review',
                        number=review.id,
                        image=photo
                    )
                    photo_list.append(image.id)

                review.content["photo_list"] = photo_list
                review.save()
        except Exception as e:
            return HttpResponse(status=HttpStatus.INTERNAL_SERVER_ERROR)

        return HttpResponse(status=HttpStatus.CREATED, content=json.dumps(
            review_serializer(review)
        ), content_type='application/json')


@api_view(["GET"])
def review_id(request, rid: int):
    try:
        review = Review.objects.get(id=rid)
    except Review.DoesNotExist as e:
        return HttpResponse(status=HttpStatus.NOT_FOUND)

    response = review_serializer(review)
    return JsonResponse(response)
