from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import *
from allauth.socialaccount.models import SocialAccount
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.shortcuts import render,redirect
from rest_framework.authtoken.models import Token



@receiver(user_signed_up)
def create_user_profile(request, user, **kwargs):
    
    user_profile = Profile(user = user,username=user.username, email=user.email, name=user.username, dp=None)
    user_profile.save()

    Token.objects.create(user=user)

    token, created = Token.objects.get_or_create(user=user)
    request.session['env_token'] = token.key




