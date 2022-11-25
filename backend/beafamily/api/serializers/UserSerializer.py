from rest_framework import serializers
from .PostSerializer import PostSerializer
from .ApplicationSerializer import ApplicationPostSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    posts = PostSerializer(many=True)
    likes = PostSerializer(many=True)
    applies = ApplicationPostSerializer(many=True)

    class Meta:
        model = User
        fields = ["username", "posts", "likes", "applies"]
