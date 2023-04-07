from django.urls import path, include
from .views import *
from rest_framework import routers



# router = routers.DefaultRouter()
# router.register(r'extrafields', ExtraFieldViewSet)



urlpatterns = [
    path('login', user_login, name="user-login"),
    path('signup', user_signup, name="user-signup"),
    path('logout', logout_user, name="user-logout"),

    # path('signin', user_login, name="user-login"),
    path('home', home, name="home"),
    path('extrafields/', ExtraFieldView.as_view(), name='extrafields-list-create'),
    path('extrafields/<int:id>/', ExtraFieldView.as_view(), name='extrafields-detail'),
    path('phone-number/', PhoneView.as_view(), name='phone-number-list-create'),
    path('phone-number/<int:id>/', PhoneView.as_view(), name='phone-number-detail'),
    path('email-id/', EmailView.as_view(), name='email-id-list-create'),
    path('email-id/<int:id>/', EmailView.as_view(), name='email-id-detail'),
    path('get/token/', ObtainAuthToken.as_view(), name='token_obtain'),
    path('get/google/token/', MyAPIView.as_view(), name='token_google'),
    path('get/<slug:slug>', update_card, name='get-user'),

    path('icons/', IconView.as_view(), name='icon-list'),
]
