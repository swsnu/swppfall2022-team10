from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models


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
    likes = models.ManyToManyField("Post", related_name="likes")

    objects = UserManager()

    class Meta:
        db_table = "user"

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []
