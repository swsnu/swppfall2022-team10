from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Application
from docx import Document

User = get_user_model()


class UserNameField(serializers.RelatedField):
    def to_representation(self, instance):
        return instance.username


class ApplicationFieldSerializer(serializers.RelatedField):
    def to_representation(self, value):
        return value.file.url


def form_validator(file):
    try:
        doc = Document(file)
    except:
        raise serializers.ValidationError()
