from rest_framework import serializers
from .models import *

class ExtraFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraField
        fields = '__all__'


class PhoneFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = '__all__'


class EmailFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailId
        fields = '__all__'



class IconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Icon
        fields = '__all__'
