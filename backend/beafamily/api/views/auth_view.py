from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, login, logout
from django.http.response import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, BaseAuthentication
from .utils import HttpStatus

User = get_user_model()


@api_view(["POST"])
@authentication_classes([BasicAuthentication])
def signin(request):
    print(request.user)
    login(request, user=request.user)
    return HttpResponse(status=HttpStatus.OK)


@api_view(["GET"])
def signout(request):
    logout(request)
    return HttpResponse(status=HttpStatus.NO_CONTENT)


@ensure_csrf_cookie
@api_view(["GET"])
def token(request):
    return HttpResponse(status=HttpStatus.NO_CONTENT)
