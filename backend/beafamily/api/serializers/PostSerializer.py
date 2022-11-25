from ..models import Post, PostImage, PostComment
from rest_framework import serializers


class PostCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = PostComment
        fields = ["id", "author_id", "author_name", "content", "created_at"]

    def to_representation(self, instance):
        ret = super(PostCommentSerializer, self).to_representation(instance)
        if self.context:
            user = self.context["user"]
            ret["editable"] = user == instance.author

        return ret


class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    photo_path = serializers.StringRelatedField(many=True, read_only=True)
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    comments = PostCommentSerializer(many=True)

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
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context:
            user = self.context["user"]
            ret["editable"] = user == instance.author

        return ret
