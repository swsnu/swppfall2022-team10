from ..models import Post, PostImage
from rest_framework import serializers


class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    photo_path = serializers.StringRelatedField(many=True, read_only=True)
    author_name = serializers.StringRelatedField(source="author", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author_id",
            "author_name",
            "created_at",
            "title",
            "animal_type",
            "name",
            "content",
            "neutering",
            "vaccination",
            "age",
            "gender",
            "species",
            "is_active",
            "photo_path",
        ]
