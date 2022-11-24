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
    age = models.IntegerField()
    name = models.CharField(max_length=50)
    gender = models.BooleanField()
    species = models.CharField(max_length=30)
    is_active = models.BooleanField()


def post_serializer(post: Post):
    photo_list = [p.image.url for p in post.postimage_set.all()]
    # comment_list = [comment_serializer(c) for c in post.postcomment_set.all()]
    response = {
        "id": post.id,
        "author_id": post.author.id,
        "author_name": post.author.username,
        "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "title": post.title,
        "animal_type": post.animal_type,
        "name": post.name,
        "species": post.species,
        "vaccination": post.vaccination,
        "neutering": post.neutering,
        "is_active": post.is_active,
        "age": post.age,
        "gender": post.gender,
        "content": post.content,
        "photo_path": photo_list,
    }
    return response


def post_image_upload_to(instance, filename):
    return f"post/{instance.post.id}/{filename}"


class PostImage(AbstractImageType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="photo_list")
    image = models.ImageField(upload_to=post_image_upload_to)

    def __str__(self):
        return self.image.url


class PostComment(AbstractCommentType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
