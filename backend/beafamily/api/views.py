from django.shortcuts import render
from django.db import models
from .models import *
from django.http.response import (
    HttpResponseBadRequest,
    JsonResponse,
    HttpResponseNotFound,
)
import json

#   {
#      "id": 0,
#      "author_id": 1,
#      "author_name": "jinhee1216",
#      "title": "강아지 ‘해피’ 입양하실 분 찾아요",
#      "name": "해피",
#      "vaccination": true,
#      "neutering": true,
#      "animal_type": "개",
#      "species": "골든 리트리버",
#      "photo_path": [
#         "https://d1bg8rd1h4dvdb.cloudfront.net/upload/imgServer/storypick/editor/2020062615503065168.jpg",
#         "https://image.petmd.com/files/2022-06/golden-retriever.jpg"
#      ],
#      "age": 2,
#      "gender": true,
#      "created_at": "2022-10-03 15:47",
#  "character": "밥을 아주 잘 먹어요!<br>처음 보는 사람은 조금 낯가려요.<br>안 보이는 곳에서 나는 소리에 대해 살짝 겁이 있지만 대체로 무던해요"
#   },



def getPost(request, pid=0):
    if request.method == "GET":
        try:
            post = Post.objects.get(id=pid)
            info_response = post_serializer(post)

            return JsonResponse(info_response, safe=False)

        except:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


def getPostList(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        response_list = []
        for post in post_list.iterator():
            response = post_serializer(post)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    else:
        return HttpResponseBadRequest()

def getReviewList(request):

    if request.method == "GET":

        response_list = []
        review_list = Review.objects.all()
        for review in review_list.iterator():
            response = review_serializer(review)
            response_list.append(response)

        return JsonResponse(response_list, safe=False)

    else:
        return HttpResponseBadRequest()


def getReview(request, rid: int):
    if request.method == "GET":

        try:
            review = Review.objects.get(id=rid)
            response = review_serializer(review)
            return JsonResponse(response)


        except:
            return HttpResponseNotFound()


    else:
        return HttpResponseBadRequest()