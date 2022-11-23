from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, username: str, password=None):
        if username is None:
            raise ValueError("Username is required")

        if type(username) != str:
            raise TypeError("Username must be string")

        if password is not None and type(password) != str:
            raise TypeError("Password must be string")

        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)

        return user


# Create your models here.
class User(AbstractBaseUser):
    username = models.CharField(max_length=30, unique=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    post_bookmarks = models.ManyToManyField("Post")

    objects = UserManager()

    class Meta:
        db_table = "user"

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []


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
    photo_list = PostImage.objects.filter(post=post)
    photo_list = [p.image.url for p in photo_list]
    response = {
        "id": post.id,
        "author_id": post.author.id,
        "author_name": post.author.username,
        "created_at": str(post.created_at),
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


class Application(AbstractMetaDataType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    content = models.TextField()
    acceptance = models.IntegerField(default=0)


class Question(AbstractArticleType):
    pass


class Review(AbstractArticleType):
    pass


def review_serializer(review: Review):
    # photo_list = review.content["photo_list"]
    # photo_list = ReviewImage.objects.filter(id__in=photo_list)
    photo_list = ReviewImage.objects.filter(review=review)
    photo_list = [p.image.url for p in photo_list]

    response = {
        "author_id": review.author.id,
        "author_name": review.author.username,
        "id": review.id,
        "title": review.title,
        "photo_path": photo_list,
        "content": review.content,
    }
    return response


class AbstractCommentType(AbstractMetaDataType):
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.CharField(max_length=500)

    class Meta:
        abstract = True


class PostComment(AbstractCommentType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)


class QuestionComment(AbstractCommentType):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)


class AbstractImageType(AbstractMetaDataType):
    image = models.ImageField()

    class Meta:
        abstract = True


def post_image_upload_to(instance, filename):
    return f"post/{instance.post.id}/{filename}"


class PostImage(AbstractImageType):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=post_image_upload_to)


def review_image_upload_to(instance, filename):
    return f"review/{instance.review.id}/{filename}"


class ReviewImage(AbstractImageType):
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=review_image_upload_to)
