from django.db import models
from .AbstractTypes import (
    AbstractArticleType,
    AbstractCommentType,
    AbstractImageType,
    comment_serializer,
)
from django.contrib.auth import get_user_model


def thumbnail_upload_to(instance, filename):
    return f'post/{instance.id}/thumbnail/{filename}'

class Post(AbstractArticleType):
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="posts"
    )
    animal_type = models.CharField(max_length=10)
    neutering = models.BooleanField()
    vaccination = models.BooleanField()
    age = models.PositiveIntegerField()
    name = models.CharField(max_length=50)
    gender = models.BooleanField()
    species = models.CharField(max_length=30)
    is_active = models.BooleanField()
    form = models.FileField()
    accepted_application = models.OneToOneField(
        "Application",
        on_delete=models.CASCADE,
        null=True,
        default=None,
        related_name="accepted_application",
    )
    thumbnail = models.ImageField(upload_to=thumbnail_upload_to)

    class Meta:
        db_table = "post"
        ordering = ["-created_at"]


def post_image_upload_to(instance, filename):
    return f"post/{instance.post.id}/{filename}"


class PostImage(AbstractImageType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="photo_path")
    image = models.ImageField(upload_to=post_image_upload_to)

    def __str__(self):
        return self.image.url

    class Meta:
        db_table = "post_image"


class PostComment(AbstractCommentType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")

    class Meta:
        db_table = "post_comment"
