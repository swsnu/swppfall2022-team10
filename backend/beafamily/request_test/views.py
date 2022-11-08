from django.http import QueryDict
from django.shortcuts import render
from django.http.response import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, JSONParser, FileUploadParser
from rest_framework.decorators import api_view, parser_classes
from .models import ImageTest
from PIL import Image

import json
import time


# Create your views here.

@csrf_exempt
@api_view(['POST', "PUT", "GET"])
@parser_classes([MultiPartParser, JSONParser, FileUploadParser])
def test(request):
    # print(type(request.data) == dict)
    # print(request.data)
    # print(dict(request.data))
    # print(request.data.getlist('file'))
    # print(request.data.pop('file'))
    # print(request.data.pop('json'))

    try:
        request.data.pop("notexists")
    except Exception as e:
        print("intended error")

    imgs = request.data.pop('file')
    print(imgs)
    request.data.pop("json")

    # print(request.data == QueryDict())
    print(len(request.data))

    try:
        # img.image.save(save=True)
        # img.image.check()
        # print(img.check())
        img = Image.open(imgs[0])
        img.verify()


        # img.save()
    except Exception as e:
        print("intended error 1: not valid image")
        print(e)

    # img = ImageTest(image=imgs[1])
    # print("not saved yet")
    # time.sleep(10)
    # print("now saved")
    # img.save()

    try:
        img = Image.open(imgs[1])
        img.verify()
        img.close()
        img = ImageTest(image=imgs[1])
        print(img.check())
        # img.image.save(save=True)

        # img.save()
    except Exception as e:
        print("intended error 2: not valid image")
        print(e)

    print(img.id)
    # print(request.data.empty())
    # print(type(request.data))
    # try:
    #     res = request.body.decode()
    #     print(request.body)
    #     print(res)
    #     print(json.loads(res))
    #     print(request.body['json'])
    #     print(request.FILES['source'])
    #     print(request.body.decode())
    #     print(len(request.POST.keys()))
    #     print(request.POST.getlist(''))
    #     print(request.data.decode())
    #     print(request.method)
    #     print(request.headers)
    #     print(parser.parse(request.data))
    #     print(request.body.decode())
    #     print(request.headers)
    #     print(request.body.decode())
    #     print(parser.parse(request.body.decode()))
    #     print(parser.parse(request))
    #     print(request.data)
    #     print(type(request.data.get('source')))
    #     print(request.data.get('source').read().decode())
    #     print(type(request.data.get('json')))
    #     print(parser.parse(request.data))


    # except Exception as e:
    #     print("ERROR")
    #     print(e)
    #     return HttpResponse(status=400)

    return HttpResponse(status=200)
    # return HttpResponse(status=405)
