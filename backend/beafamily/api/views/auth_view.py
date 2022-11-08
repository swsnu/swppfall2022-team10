from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view

from .utils import HttpStatus

User = get_user_model()


@csrf_exempt
@api_view(["POST"])
def signin(request):
    user = User.objects.get(id=2)
    login(request, user)
    return HttpResponse(status=HttpStatus.OK)


@api_view(["GET"])
def signout(request):
    logout(request)
    return HttpResponse(status=HttpStatus.NO_CONTENT)
