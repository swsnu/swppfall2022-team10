from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.apps import apps


class UserManager(BaseUserManager):
    def create_user(
        self, username: str, password=None, email=None, nickname=None, address=None
    ):
        if username is None:
            raise ValueError("Username is required")

        if nickname is None:
            nickname = username

        if type(username) != str:
            raise TypeError("Username must be string")

        if password is not None and type(password) != str:
            raise TypeError("Password must be string")

        if email is not None:
            email = self.normalize_email(email)

        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)

        user = self.model(
            username=username, email=email, nickname=nickname, address=address
        )
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
    likes = models.ManyToManyField("Post", related_name="likes")
    email = models.EmailField(null=True, unique=True)
    nickname = models.CharField(max_length=30, unique=True, null=True)
    address = models.CharField(max_length=100, null=True)
    profile = models.ImageField(null=True)
    shelter = models.BooleanField(default=False)

    objects = UserManager()

    class Meta:
        db_table = "user"

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [nickname]
