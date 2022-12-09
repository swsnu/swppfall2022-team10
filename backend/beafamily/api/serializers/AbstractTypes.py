from rest_framework import serializers


class SerializerWithAuth(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if self.context:
            user = self.context["user"]
            ret["editable"] = user == instance.author

        return ret

    class Meta:
        abstract = True


class PaginationValidator(serializers.Serializer):

    page = serializers.IntegerField(required=False, min_value=0)
    page_size = serializers.IntegerField(required=False, min_value=0)

    class Meta:
        fields = ["page", "page_size"]
