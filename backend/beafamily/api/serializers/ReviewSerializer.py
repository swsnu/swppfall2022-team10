from ..models import Review, ReviewImage
from rest_framework import serializers
from .AbstractTypes import SerializerWithAuth, PaginationValidator
from .utils import UserNameField
from .ImageSerializer import ImageURLField


class ReviewSerializer(SerializerWithAuth):
    author_name = UserNameField(source="author", read_only=True)
    photo_path = ImageURLField(read_only=True, many=True)

    class Meta:
        model = Review
        fields = [
            "author_id",
            "author_name",
            "id",
            "title",
            "photo_path",
            "content",
            "animal_type",
        ]


class ReviewValidator(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["title", "content", "animal_type"]


class ReviewQueryValidator(PaginationValidator):
    animal_type = serializers.CharField(required=False)

    class Meta:
        fields = ["animal_type", "page", "page_size"]
