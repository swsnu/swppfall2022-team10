from ..models import Question, QuestionComment
from rest_framework import serializers
from .AbstractTypes import SerializerWithAuth


class QuestionCommentSerializer(SerializerWithAuth):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    author_name = serializers.StringRelatedField(source="author", read_only=True)

    class Meta:
        model = QuestionComment
        fields = ["id", "content", "author_name", "author_id", "created_at"]


class QuestionCommentValidator(serializers.ModelSerializer):
    class Meta:
        model = QuestionComment
        fields = ["content"]


class QuestionSerializer(SerializerWithAuth):
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")
    author_name = serializers.StringRelatedField(source="author", read_only=True)
    comments = QuestionCommentSerializer(many=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "author_id",
            "author_name",
            "title",
            "content",
            "created_at",
            "comments",
        ]


class QuestionValidator(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["title", "content"]
