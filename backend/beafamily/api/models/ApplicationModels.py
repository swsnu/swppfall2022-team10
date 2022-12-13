from django.db import models

from .AbstractTypes import AbstractMetaDataType
from .PostModels import Post
from django.contrib.auth import get_user_model


def form_upload_to(instance, filename):
    return f"application/{instance.id}/{filename}"


class Application(AbstractMetaDataType):
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="applies"
    )
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, related_name="applications"
    )
    file = models.FileField(upload_to=form_upload_to)

    class Meta:
        ordering = ["-created_at"]
        db_table = "application"
