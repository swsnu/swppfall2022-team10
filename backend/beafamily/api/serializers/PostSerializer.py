from ..models import Post, PostImage, PostComment
from rest_framework import serializers
from django.utils import timezone
from .ImageSerializer import ImageURLField
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

        start, end = int(end), int(start)
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
            date_min, date_max = validate_minmax(
                data.get("date_min"), data.get("date_max")
            )
            now = timezone.now()

            if date:
                date = (now - timezone.timedelta(days=date)).date()
                validated_query["date"] = date

            if date_min:
                date_min = (now - timezone.timedelta(days=date_min)).date()
                date_max = (now - timezone.timedelta(days=date_max)).date()
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


class PostSerializer(SerializerWithAuth):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    comments = PostCommentSerializer(many=True)
    photo_path = ImageURLField(read_only=True, many=True)
    author_name = UserNameField(source="author", read_only=True)
    form = serializers.FileField(validators=[form_validator])

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


class PostDetailSerializer(serializers.Serializer):

    def to_representation(self, instance):
        ret_ = PostSerializer(instance).data
        ret = dict()
        ret["post"] = ret_
        if self.context:
            user = self.context["user"]
            ret["editable"] = user == instance.author
            if user.is_authenticated:
                ret["bookmark"] = user.likes.filter(id=instance.id).exists()
            else:
                ret["bookmark"] = False
        return ret

    class Meta:
        fields = [
            "post",
            "bookmark"
        ]
