from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from .models import *
from allauth.socialaccount.models import SocialAccount
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.shortcuts import render,redirect
from rest_framework.authtoken.models import Token
from django.utils.text import slugify



@receiver(user_signed_up)
def create_user_profile(request, user, **kwargs):
    
    
    slug = slugify(user.username.lower())
    user_profile = Profile(user = user,username=user.username, name=user.username, dp=None, slug = slug)
    user_profile.save()

    Token.objects.create(user=user)

    token, created = Token.objects.get_or_create(user=user)
    request.session['env_token'] = token.key

    EmailId.objects.create(user=user, email_type='Personal', email_id = user.email)




