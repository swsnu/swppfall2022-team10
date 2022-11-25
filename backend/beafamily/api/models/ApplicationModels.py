from django.db import models

from .AbstractTypes import AbstractMetaDataType
from .PostModels import Post


class Application(AbstractMetaDataType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    acceptance = models.IntegerField(default=0)
