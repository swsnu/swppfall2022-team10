from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserNameField(serializers.Field):
    def to_representation(self, instance):
        return instance.username
