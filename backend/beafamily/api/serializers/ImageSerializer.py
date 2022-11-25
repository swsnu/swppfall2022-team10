from rest_framework import serializers
from PIL import Image
from ..models import AbstractImageType


def validate_image(f):
    img = Image.open(f)
    img.verify()


class ImageValidator(serializers.Serializer):
    image = serializers.ImageField(validators=[validate_image])

    class Meta:
        fields = ["image"]


class ImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = AbstractImageType
        fields = ["image"]

    def to_representation(self, instance):
        return instance.image.url
