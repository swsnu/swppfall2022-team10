from django.shortcuts import render
from django.db import models
from .models import Post
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
            # print(pid)
            post = Post.objects.get(post_id=pid)
            file_path = post.post_detail
            with open(f"{file_path}/info.json", "r", encoding='UTF-8') as f:
                info = json.loads(f.read())
                info_response = {
                    "id": post.post_id,
                    "author_id": post.user_id,
                    "created_at": str(post.post_date),
                    **info,
                }
            return JsonResponse(info_response, safe=False)

        except:
            return HttpResponseNotFound()
    else:
        return HttpResponseBadRequest()


def getPostList(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        response_list = []
        # print(len(list(post_list.iterator())))
        for post in post_list.iterator():
            file_path = post.post_detail
            with open(f"{file_path}/info.json", "r", encoding='UTF-8') as f:
                info = json.loads(f.read())
                info_response = {
                    "id": post.post_id,
                    "author_id": post.user_id,
                    "created_at": str(post.post_date),
                    **info,
                }
                response_list.append(info_response)

        # response_json = json.dumps(response_list)
        return JsonResponse(response_list, safe=False)

    else:
        return HttpResponseBadRequest()
