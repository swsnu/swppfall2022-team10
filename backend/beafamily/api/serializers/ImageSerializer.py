from rest_framework import serializers
from PIL import Image
from ..models import Application, PostImage


def validate_image(f):
    img = Image.open(f)
    img.verify()


class ImageValidator(serializers.Serializer):
    image = serializers.ImageField(validators=[validate_image])

    class Meta:
        fields = ["image"]


class ImageURLField(serializers.RelatedField):
    def to_representation(self, value):
        return value.image.url

    def to_internal_value(self, data):
        pass


class PostImageSerializer(serializers.ModelSerializer):
    photo_path = serializers.ImageField(use_url=True, source="image")

    class Meta:
        model = PostImage
        fields = ["id", "photo_path"]
