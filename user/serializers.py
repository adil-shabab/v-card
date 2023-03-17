from rest_framework import serializers
from .models import ExtraField

class ExtraFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraField
        fields = '__all__'
