from django.db import models
from django.contrib.auth import get_user_model

from .AbstractTypes import AbstractArticleType, AbstractCommentType


class Question(AbstractArticleType):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="questions")
    class Meta:
        ordering = ["-created_at"]


class QuestionComment(AbstractCommentType):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="comments"
    )
