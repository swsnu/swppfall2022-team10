from django.db import models

from .AbstractTypes import (
    AbstractArticleType,
    AbstractCommentType,
    AbstractImageType,
    comment_serializer,
)


class Post(AbstractArticleType):
    animal_type = models.CharField(max_length=10)
    neutering = models.BooleanField()
    vaccination = models.BooleanField()
    age = models.PositiveIntegerField()
    name = models.CharField(max_length=50)
    gender = models.BooleanField()
    species = models.CharField(max_length=30)
    is_active = models.BooleanField()

    class Meta:
        ordering = ["-created_at"]


def post_image_upload_to(instance, filename):
    return f"post/{instance.post.id}/{filename}"


class PostImage(AbstractImageType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="photo_path")
    image = models.ImageField(upload_to=post_image_upload_to)

    def __str__(self):
        return self.image.url


class PostComment(AbstractCommentType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
