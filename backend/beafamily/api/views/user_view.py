import logging

from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..serializers import UserPostSerializer, UserInfoSerializer

from .utils import log_error

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
