import logging

from django.db import transaction
from django.urls import reverse
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    parser_classes,
    permission_classes,
)
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from ..models import Question, QuestionComment
from ..serializers import (
    QuestionSerializer,
    QuestionCommentSerializer,
    PaginationValidator,
    QuestionValidator,
    QuestionCommentValidator,
)

from .utils import log_error, pagination, verify, verify_json_request

logger = logging.getLogger("view_logger")


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
# @verify(PostValidator, PostQueryValidator)
@log_error(logger)
def question_id(request, qid=0):
    try:
        question = Question.objects.get(id=qid)
    except Question.DoesNotExist as e:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        info_response = QuestionSerializer(
            question, context={"user": request.user}
        ).data
        return Response(info_response)

    elif request.method == "PUT":
        if question.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_200_OK)

    else:
        if question.author != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        question.delete()
        return Response(status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser])
@verify(QuestionValidator, PaginationValidator, has_image=False, has_form=False)
@log_error(logger)
def questions(request):
    if request.method == "GET":
        question_list = Question.objects.prefetch_related("comments")
        api_url = reverse(questions)

        response = pagination(request, question_list, api_url, QuestionSerializer)

        if not response:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(response)

    else:
        query = request.parsed
        question = Question.objects.create(author=request.user, **query)

        return Response(
            status=status.HTTP_201_CREATED, data=QuestionSerializer(question).data
        )


@api_view(["PUT", "DELETE"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([JSONParser])
@verify_json_request(QuestionCommentValidator, None)
def question_comment_id(request, qid, cid):
    try:
        qc = QuestionComment.objects.get(id=cid)
        q = Question.objects.get(id=qid)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if qc.author != request.user or qc.question != q:
        return Response(status=status.HTTP_403_FORBIDDEN)
    if request.method == "PUT":
        qc.content = request.parsed["content"]
        qc.save()
    else:
        qc.delete()

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([JSONParser])
@verify_json_request(QuestionCommentValidator, None)
@log_error(logger)
def questions_comment(request, qid):
    try:
        q = Question.objects.get(id=qid)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    qc = QuestionComment.objects.create(
        author=request.user, question=q, **request.parsed
    )
    return Response(status=status.HTTP_201_CREATED)
