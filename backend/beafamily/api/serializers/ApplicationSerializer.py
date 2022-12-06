from rest_framework import serializers
from ..models import Application, Post
from .PostSerializer import PostSerializer
from .utils import form_validator


class ApplicationPostSerializer(serializers.ModelSerializer):
    post = PostSerializer()

    class Meta:
        model = Application
        fields = ["post"]


class ApplicationValidator(serializers.ModelSerializer):
    form = serializers.FileField(validators=[form_validator])

    class Meta:
        model = Application
        fields = [
            "form"
        ]
