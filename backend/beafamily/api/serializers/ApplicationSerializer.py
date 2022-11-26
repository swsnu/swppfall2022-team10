from rest_framework import serializers
from ..models import Application, Post
from ..serializers import PostSerializer


class ApplicationPostSerializer(serializers.ModelSerializer):
    post = PostSerializer()

    class Meta:
        model = Application
        fields = ["post"]
