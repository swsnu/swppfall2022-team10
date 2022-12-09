import logging

from django.db import transaction
from django.urls import reverse
from django.http.response import FileResponse
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import FileUploadParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response

from ..models import Post, PostImage, Application, User
from ..serializers import (
    PostSerializer,
    PostQueryValidator,
    PostValidator,
    PostDetailSerializer,
    ApplicationValidator,
    ApplicationSerializer,
)
from .utils import log_error, pagination, verify

logger = logging.getLogger("view_logger")


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
# @verify(PostValidator, PostQueryValidator)
@log_error(logger)
def post_id(request, pid=0):
    try:
        post = Post.objects.get(id=pid)
    except Post.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":

        info_response = PostDetailSerializer(post, context={"user": request.user}).data

        return Response(info_response)

    elif request.method == "PUT":

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_200_OK)

    else:

        if post.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify(PostValidator, PostQueryValidator, has_form=True)
@log_error(logger)
def posts(request):
    if request.method == "GET":
        post_list = Post.objects.all()
        query = request.query

        date = query.get("date")
        date_min, date_max = query.get("date_min"), query.get("date_max")
        if date is not None:
            post_list = post_list.filter(created_at__date=date)
        elif date_min is not None:
            post_list = post_list.filter(created_at__date__range=[date_min, date_max])

        age = query.get("age")
        age_min, age_max = query.get("age_min"), query.get("age_max")
        if age is not None:
            post_list = post_list.filter(age=age)
        elif age_min is not None:
            post_list = post_list.filter(age__range=[age_min, age_max])

        is_active = query.get("is_active")
        if is_active:
            post_list = post_list.filter(is_active=is_active)

        gender = query.get("gender")
        if gender is not None:
            post_list = post_list.filter(gender=gender)

        animal_type = query.get("animal_type")
        if animal_type:
            post_list = post_list.filter(animal_type=animal_type)

        species = query.get("species")
        if query.get("species"):
            post_list = post_list.filter(species=species)

        api_url = reverse(posts)
        response = pagination(request, post_list, api_url, PostSerializer)
        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        query = request.parsed
        photos = request.data.pop("photos")

        with transaction.atomic():
            post = Post.objects.create(author=request.user, is_active=True, **query)
            thumbnail = None
            for photo in photos:
                image = PostImage.objects.create(
                    author=request.user, post=post, image=photo
                )
                if thumbnail is None:
                    thumbnail = image

            post.thumbnail = thumbnail.image
            post.save()

        return Response(status=status.HTTP_201_CREATED, data=PostSerializer(post).data)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
# @permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
@verify(ApplicationValidator, None, has_form=True, has_content=False, has_image=False)
@log_error(logger)
def post_id_application(request, pid):
    try:
        post = Post.objects.get(id=pid)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        # if request.user == post.author:
        #     app = ApplicationSerializer(post.applications, many=True)
        # else:
        #     app = ApplicationSerializer(post.applications.filter(author=request.user), many=True)
        app = ApplicationSerializer(post.applications, many=True)
        return Response(status=status.HTTP_200_OK, data=app.data)
    else:
        if request.user == post.author:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        file = request.data.getlist("application")[0]
        app = Application.objects.create(post=post, author=request.user)
        app.file = file
        app.save()
        data = ApplicationSerializer(app).data

        return Response(status=status.HTTP_201_CREATED, data=data)


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
# @permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
@verify(ApplicationValidator, None, has_form=True, has_content=False, has_image=False)
@log_error(logger)
def post_id_application_id(request, pid, aid):
    try:
        post = Post.objects.get(id=pid)
        app = Application.objects.get(id=aid)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if post != app.post:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if request.method == "GET":
        # if post.author != request.user or app.author != request.user:
        #     return Response(status=status.HTTP_204_NO_CONTENT)

        return FileResponse(app.file.file, as_attachment=True)
    elif request.method == "PUT":
        if app.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        file = request.data.getlist("application")[0]
        app.file = file
        app.save()
        app = ApplicationSerializer(app)

        return Response(status=status.HTTP_200_OK, data=app.data)
    else:
        if app.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)
        app.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@log_error(logger)
def post_bookmark(request, pid):
    try:
        post = Post.objects.get(id=pid)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    user: User = request.user
    exists = user.likes.filter(id=post.id).exists()
    if exists:
        user.likes.remove(post)
    else:
        user.likes.add(post)

    return Response(status=status.HTTP_200_OK, data={"bookmark": not exists})


@api_view(["DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
@log_error(logger)
def delete_post_photo(request, pid, iid):
    try:
        p = Post.objects.get(id=pid)
        i = PostImage.objects.get(id=iid)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if i.post != p:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if p.author != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    i.delete()

    return Response(status=status.HTTP_200_OK)
