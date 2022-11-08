from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your models here.

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now=True)
    animal_type = models.CharField(max_length=10)
    neutering = models.BooleanField()
    vaccination = models.BooleanField()
    age = models.IntegerField()
    name = models.CharField(max_length=50)
    gender = models.BooleanField()
    species = models.CharField(max_length=30)
    title = models.CharField(max_length=100)
    is_active = models.BooleanField()
    content = models.JSONField()  # photo and texts


def post_serializer(post: Post):
    photo_list = post.content["photo_list"]
    photo_list = Photo.objects.filter(id__in=photo_list)
    photo_list = [p.image.url for p in photo_list]
    response = {
        "id": post.id,
        "author_id": post.author.id,
        "author_name": post.author.username,
        "created_at": str(post.datetime),
        "title": post.title,
        "animal_type": post.animal_type,
        "name": post.name,
        "species": post.species,
        "vaccination": post.vaccination,
        "neutering": post.neutering,
        "age": post.age,
        "gender": post.gender,
        "content": post.content["text"],
        "photo_path": photo_list
    }
    return response


class Application(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now=True)
    content = models.JSONField()
    acceptance = models.IntegerField(default=0)


class Question(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now=True)
    content = models.JSONField()


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=100)
    content = models.JSONField()


def review_serializer(review: Review):
    photo_list = review.content["photo_list"]
    photo_list = Photo.objects.filter(id__in=photo_list)
    photo_list = [p.image.url for p in photo_list]

    response = {
        "author_id": review.author.id,
        "author_name": review.author.username,
        "id": review.id,
        "title": review.title,
        "photo_path": photo_list,
        "content": review.content['text']
    }
    return response


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now=True)
    content = models.CharField(max_length=500)


def image_upload_to(instance, filename):
    # such as post/1/cat2.jpg
    return f'{instance.category}/{instance.number}/{filename}'


class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=20)
    number = models.IntegerField()
    image = models.ImageField(upload_to=image_upload_to)
    datetime = models.DateTimeField(auto_now=True)
