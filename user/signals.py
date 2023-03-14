from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import *
from allauth.socialaccount.models import SocialAccount
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

@receiver(user_signed_up)
def create_user_profile(request, user, **kwargs):
    
    user_profile = Profile(user = user,username=user.username, email=user.email, name=user.username, dp=None)
    user_profile.save()


