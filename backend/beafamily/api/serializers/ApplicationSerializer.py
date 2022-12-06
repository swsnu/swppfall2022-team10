from rest_framework import serializers
from ..models import Application, Post
from .PostSerializer import PostSerializer
from .utils import form_validator, UserNameField, ApplicationFieldSerializer


class ApplicationPostSerializer(serializers.ModelSerializer):
    post = PostSerializer()

    class Meta:
        model = Application
        fields = ["post"]


class ApplicationSerializer(serializers.ModelSerializer):
    author_name = UserNameField(source="author", read_only=True)
    file = serializers.FileField(use_url=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "file",
            "created_at",
            "post_id",
            "author_id",
            "author_name"
        ]


class ApplicationValidator(serializers.ModelSerializer):
    file = serializers.FileField(validators=[form_validator])

    class Meta:
        model = Application
        fields = [
            "file"
        ]
