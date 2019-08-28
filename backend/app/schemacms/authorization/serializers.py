from django.contrib import auth
from rest_framework import serializers

from schemacms.authorization import tokens


USER_MODEL = auth.get_user_model()


class ObtainJSONWebTokenSerializer(serializers.Serializer):
    uid = serializers.PrimaryKeyRelatedField(queryset=USER_MODEL.objects.filter(is_active=True))
    token = serializers.CharField()

    def validate(self, attrs):
        validated_data = super().validate(attrs)
        user = validated_data['uid']
        token = validated_data['token']
        if not (token and tokens.exchange_token.check_token(user, token)):
            raise serializers.ValidationError({'token': 'Invalid Token'})
        return validated_data
