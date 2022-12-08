from rest_framework import serializers
from .PostSerializer import PostSerializer
from .ApplicationSerializer import ApplicationPostSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserPostSerializer(serializers.ModelSerializer):
    posts = PostSerializer(many=True)
    likes = PostSerializer(many=True)
    applies = ApplicationPostSerializer(many=True)

    class Meta:
        model = User
        fields = ["username", "posts", "likes", "applies"]


class UserInfoSerializer(serializers.ModelSerializer):
    photo_path = serializers.ImageField(source="profile", use_url=True)

    class Meta:
        model = User
        fields = ["username", "photo_path", "email"]


class SignUpValidator(serializers.ModelSerializer):
    def to_internal_value(self, data):
        for key, val in data.items():
            if val == "":
                data[key] = None

        return super().to_internal_value(data)

    class Meta:
        model = User
        fields = ["username", "password", "email"]
