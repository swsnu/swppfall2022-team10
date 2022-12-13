from rest_framework import serializers
from ..models import Application, Post
from .PostSerializer import PostSerializer
from .utils import form_validator, UserNameField, ApplicationFieldSerializer
from pathlib import Path


class ApplicationPostSerializer(serializers.ModelSerializer):
    post = PostSerializer()

    class Meta:
        model = Application
        fields = ["post"]


class FileNameField(serializers.FileField):
    def to_representation(self, value):
        p = Path(value.name)
        return p.name


class ApplicationSerializer(serializers.ModelSerializer):
    author_name = UserNameField(source="author", read_only=True)
    file = FileNameField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Application
        fields = ["id", "file", "created_at", "post_id", "author_id", "author_name"]


class ApplicationValidator(serializers.ModelSerializer):
    file = serializers.FileField(validators=[form_validator])

    class Meta:
        model = Application
        fields = ["file"]
