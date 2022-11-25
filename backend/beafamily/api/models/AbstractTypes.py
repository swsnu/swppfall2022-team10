from django.contrib.auth import get_user_model
from django.db import models


class AbstractMetaDataType(models.Model):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class AbstractArticleType(AbstractMetaDataType):
    title = models.CharField(max_length=50)
    content = models.TextField()
    type = models.CharField(max_length=10)

    class Meta:
        abstract = True


class AbstractCommentType(AbstractMetaDataType):
    content = models.CharField(max_length=500)

    class Meta:
        abstract = True


class AbstractImageType(AbstractMetaDataType):
    image = models.ImageField()

    class Meta:
        abstract = True


def comment_serializer(c: AbstractCommentType):
    return {
        "author_id": c.author.id,
        "author_name": c.author.name,
        "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "content": c.content,
    }
