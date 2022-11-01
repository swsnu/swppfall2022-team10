import uuid
from django.db import models

# Create your models here.


class Post(models.Model):
    # post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post_id = models.IntegerField(primary_key=True, default=0)
    user_id = models.IntegerField(default=0)  # TODO: ForeignKey User
    post_date = models.DateField(auto_now=True)
    post_time = models.TimeField(auto_now=True)
    post_detail = models.FilePathField()  # path to post info json


class Application(models.Model):
    # post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    apply_id = models.IntegerField(primary_key=True, default=0)
    user_id = models.IntegerField(default=0)  # TODO: ForeignKey User
    apply_date = models.DateField(auto_now=True)
    apply_time = models.TimeField(auto_now=True)
    apply_detail = models.FilePathField()
    acceptance = models.IntegerField(default=0)


class Question(models.Model):
    # question_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_id = models.IntegerField(primary_key=True, default=0)
    user_id = models.IntegerField(default=0)  # TODO: ForeignKey User
    question_date = models.DateField(auto_now=True)
    question_time = models.TimeField(auto_now=True)
    question_content = models.FilePathField()


class Review(models.Model):
    # review_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    review_id = models.IntegerField(primary_key=True, default=0)
    user_id = models.IntegerField(default=0)  # TODO: ForeignKey User
    review_date = models.DateField()
    review_time = models.DateTimeField()
    review_content = models.FilePathField()
