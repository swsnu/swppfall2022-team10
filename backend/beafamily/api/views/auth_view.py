import logging

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response

from .utils import log_error

logger = logging.getLogger("view_logger")

User = get_user_model()


@api_view(["POST"])
@authentication_classes([BasicAuthentication])
@log_error(logger)
def signin(request):
    login(request, user=request.user)
    return Response(status=status.HTTP_200_OK)


@api_view(["GET"])
@log_error(logger)
def signout(request):
    logout(request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@ensure_csrf_cookie
@api_view(["GET"])
@log_error(logger)
def token(request):
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@log_error(logger)
def check_login(request):
    is_logged_in = request.user and request.user.is_authenticated
    return Response(status=status.HTTP_200_OK, data={"logged_in": is_logged_in})
