import logging

from django.contrib.auth import get_user_model

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
    parser_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser

from ..serializers import UserPostSerializer, UserInfoSerializer, SignUpValidator

from .utils import log_error, verify

User = get_user_model()
logger = logging.getLogger("view_logger")


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@log_error(logger)
def user_info(request):
    u = UserInfoSerializer(request.user).data
    return Response(u)


@api_view(["GET"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@log_error(logger)
def user_post(request):
    u = UserPostSerializer(request.user).data

    response = [u["posts"], u["likes"], u["applies"]]

    return Response(response)


@api_view(["POST"])
@parser_classes([MultiPartParser])
@verify(SignUpValidator, None, has_image=False)
def signup(request):
    u = User.objects.create_user(**request.parsed)
    if "photos" in request.data:
        photos = request.data.getlist("photos")
        u.profile = photos[0]
        u.save()
    return Response(status=status.HTTP_201_CREATED)


@api_view(["GET"])
def check_username(request):
    if "username" not in request.GET:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    username = request.GET.get("username")
    try:
        User.objects.get(username=username)
        return Response(data={"confirm": False})
    except:
        return Response(data={"confirm": True})
