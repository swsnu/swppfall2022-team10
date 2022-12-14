from django.db import models

from .AbstractTypes import AbstractArticleType, AbstractImageType
from django.contrib.auth import get_user_model

from django.db.models.signals import pre_save, pre_delete
from django.dispatch.dispatcher import receiver


class Review(AbstractArticleType):
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="reviews"
    )
    animal_type = models.CharField(max_length=10)
    thumbnail = models.ImageField()
    post = models.OneToOneField(
        "Post",
        on_delete=models.CASCADE,
        related_name="review_post",
        null=True,
        default=None,
    )

    class Meta:
        db_table = "review"
        ordering = ["-created_at"]


def review_image_upload_to(instance, filename):
    return f"review/{instance.review.id}/{filename}"


class ReviewImage(AbstractImageType):
    review = models.ForeignKey(
        Review, on_delete=models.CASCADE, related_name="photo_path"
    )
    image = models.ImageField(upload_to=review_image_upload_to)

    def __str__(self):
        return self.image.url

    class Meta:
        db_table = "review_image"


@receiver(pre_delete, sender=ReviewImage)
def cleanup_image(sender, instance, *args, **kwargs):
    if instance.image and instance.image.url:
        storage = instance.image.storage
        if storage.exists(instance.image.name):
            storage.delete(instance.image.name)
