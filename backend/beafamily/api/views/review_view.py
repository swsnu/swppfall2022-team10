from ..models import Review, review_serializer
from django.http.response import (
    JsonResponse,
    HttpResponse
)
from .utils import HttpStatus


def reviews(request):
    if request.method == "GET":

        response_list = []
        review_list = Review.objects.all()
        for review in review_list.iterator():
            response = review_serializer(review)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    else:
        return HttpResponse(status=HttpStatus.NOT_ALLOWED)


def review_id(request, rid: int):
    if request.method == "GET":

        try:
            review = Review.objects.get(id=rid)
        except Review.DoesNotExist as e:
            return HttpResponse(status=HttpStatus.NOT_FOUND)

        response = review_serializer(review)
        return JsonResponse(response)

    else:
        return HttpResponse(status=HttpStatus.NOT_ALLOWED)
