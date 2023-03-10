from django.urls import path
from .views import *


urlpatterns = [
    path('login', user_login, name="user-login"),
    path('signup', user_signup, name="user-signup"),
]