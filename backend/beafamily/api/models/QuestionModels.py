from django.db import models

from .AbstractTypes import AbstractArticleType, AbstractCommentType


class Question(AbstractArticleType):
    pass


class QuestionComment(AbstractCommentType):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="comments"
    )
