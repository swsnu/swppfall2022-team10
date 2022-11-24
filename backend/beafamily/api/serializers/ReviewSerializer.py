from ..models import Review, ReviewImage
from rest_framework import serializers


class ReviewSerializer(serializers.ModelSerializer):
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    photo_path = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Review
        fields = ["author_id", "author_name", "id", "title", "photo_path", "content"]
