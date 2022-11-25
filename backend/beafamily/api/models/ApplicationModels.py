from django.db import models

from .AbstractTypes import AbstractArticleType
from .PostModels import Post
from django.contrib.auth import get_user_model


class Application(AbstractArticleType):
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="applies"
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    acceptance = models.IntegerField(default=0)
