from django.db import models

from .AbstractTypes import AbstractArticleType, AbstractImageType
from django.contrib.auth import get_user_model


class Review(AbstractArticleType):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name="reviews")
    animal_type = models.CharField(max_length=10)
    thumbnail = models.ImageField()
    post = models.OneToOneField("Post", on_delete=models.CASCADE, related_name="review_post", null=True, default=None)

    class Meta:
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
