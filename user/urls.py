from django.urls import path
from .views import *

urlpatterns = [
    path('signin', user_login, name="user-login"),
    path('signup', user_signup, name="user-signup"),
    path('home', home, name="home"),
]
