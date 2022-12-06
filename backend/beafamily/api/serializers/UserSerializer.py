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
    class Meta:
        model = User
        fields = ["username", "nickname", "profile"]


class SignUpValidator(serializers.ModelSerializer):
    def to_internal_value(self, data):
        for key, val in data.items():
            if val == "":
                data[key] = None

        data["nickname"] = data["name"]

        return super().to_internal_value(data)

    class Meta:
        model = User
        fields = ["username", "password", "nickname", "email", "address"]
