from ..models import Post, PostImage, PostComment
from rest_framework import serializers
from django.utils import timezone
from .ImageSerializer import ImageURLField, PostImageSerializer
from .AbstractTypes import SerializerWithAuth, PaginationValidator
from .utils import UserNameField, ApplicationFieldSerializer, form_validator


def validate_nonnegative_int(x):
    if x is None:
        return None
    x = int(x)
    if x < 0:
        raise ValueError()
    return x


def validate_minmax(start, end):
    # only one exists
    if (start is None) ^ (end is None):
        raise ValueError()

    # both exists
    elif (start is not None) and (end is not None):

        start, end = int(start), int(end)
        if start < 0 or end < 0:
            raise ValueError()

        return start, end

    # not exists
    else:
        return None, None


class PostQueryValidator(PaginationValidator):
    date = serializers.DateField(required=False)
    date_min = serializers.DateField(required=False)
    date_max = serializers.DateField(required=False)

    age = serializers.IntegerField(required=False, min_value=0)
    age_min = serializers.IntegerField(required=False, min_value=0)
    age_max = serializers.IntegerField(required=False, min_value=0)

    animal_type = serializers.CharField(required=False)
    species = serializers.CharField(required=False)

    gender = serializers.BooleanField(required=False)
    is_active = serializers.BooleanField(required=False)
    shelter = serializers.BooleanField(required=False)

    def to_internal_value(self, data):

        validated_query = {}
        try:
            age = validate_nonnegative_int(data.get("age"))
            age_min, age_max = validate_minmax(data.get("age_min"), data.get("age_max"))

            if age:
                validated_query["age"] = age

            if age_min:
                validated_query["age_min"] = age_min
                validated_query["age_max"] = age_max

            date = validate_nonnegative_int(data.get("date"))
            delta_min, delta_max = validate_minmax(
                data.get("date_min"), data.get("date_max")
            )
            now = timezone.now()

            if date:
                date = (now - timezone.timedelta(days=date)).date()
                validated_query["date"] = date

            if delta_min:
                date_min = (now - timezone.timedelta(days=delta_max)).date()
                date_max = (now - timezone.timedelta(days=delta_min)).date()
                validated_query["date_min"] = date_min
                validated_query["date_max"] = date_max

            page = data.get("page")
            page_size = data.get("page_size")

            if page:
                validated_query["page"] = page

            if page_size:
                validated_query["page_size"] = page_size

            animal_type = data.get("animal_type")
            if animal_type:
                validated_query["animal_type"] = animal_type
            species = data.get("species")
            if species:
                validated_query["species"] = species

            gender = data.get("gender")
            if gender:
                validated_query["gender"] = gender
            shelter = data.get("shelter")
            if shelter:
                validated_query["shelter"] = shelter
            is_active = data.get("is_active")
            if is_active is not None:
                validated_query["is_active"] = is_active

        except Exception as e:
            raise serializers.ValidationError()

        return super(PostQueryValidator, self).to_internal_value(validated_query)

    class Meta:
        fields = [
            "animal_type",
            "date",
            "date_min",
            "date_max",
            "species",
            "age",
            "age_min",
            "age_max",
            "gender",
            "is_active",
            "page",
            "page_size",
            "shelter",
        ]


class PostValidator(serializers.ModelSerializer):
    age = serializers.IntegerField()
    gender = serializers.BooleanField()
    neutering = serializers.BooleanField()
    vaccination = serializers.BooleanField()

    class Meta:
        model = Post
        fields = [
            "animal_type",
            "age",
            "name",
            "gender",
            "title",
            "species",
            "neutering",
            "vaccination",
            "content",
        ]


class PostCommentSerializer(SerializerWithAuth):
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = PostComment
        fields = ["id", "author_id", "author_name", "content", "created_at"]


class PostSerializer(serializers.ModelSerializer):
    author_name = UserNameField(source="author", read_only=True)
    thumbnail = serializers.ImageField(use_url=True)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        if instance.shelter:
            ret["thumbnail"] = instance.thumbnail_url
            ret["author_name"] = instance.author.nickname

        return ret

    class Meta:
        model = Post
        fields = [
            "id",
            "author_name",
            "title",
            "animal_type",
            "age",
            "gender",
            "species",
            "thumbnail",
        ]


class PostDetailSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    comments = PostCommentSerializer(many=True)
    photo_path = PostImageSerializer(many=True)
    author_name = UserNameField(source="author", read_only=True)
    form = serializers.FileField(validators=[form_validator])

    def to_representation(self, instance):
        ret_ = super().to_representation(instance)
        ret = dict()
        ret["post"] = ret_
        if self.context:
            user = self.context["user"]
            ret["editable"] = user == instance.author
            if user.is_authenticated:
                ret["bookmark"] = user.likes.filter(id=instance.id).exists()
            else:
                ret["bookmark"] = False

        if instance.shelter:
            ret["post"]["photo_path"] = [
                {"id": 1, "photo_path": instance.thumbnail_url}
            ]
            ret["post"]["author_name"] = instance.author.nickname
        return ret

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
            "comments",
            "form",
        ]
