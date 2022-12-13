from django.db import models

from .AbstractTypes import AbstractMetaDataType
from .PostModels import Post
from django.contrib.auth import get_user_model
from django.db.models.signals import pre_save, pre_delete
from django.dispatch.dispatcher import receiver


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


@receiver(pre_delete, sender=Application)
def cleanup_form(sender, instance, *args, **kwargs):
    if instance.form and instance.form.url:
        storage = instance.form.storage
        if storage.exists(instance.form.name):
            storage.delete(instance.form.name)
