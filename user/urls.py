from django.urls import path, include
from .views import *
from rest_framework import routers



# router = routers.DefaultRouter()
# router.register(r'extrafields', ExtraFieldViewSet)



urlpatterns = [
    path('signin', user_login, name="user-login"),
    path('logout', logout_user, name="user-logout"),
    path('signup', user_signup, name="user-signup"),
    path('home', home, name="home"),
    path('extrafields/', ExtraFieldView.as_view(), name='extrafields-list-create'),
    path('extrafields/<int:id>/', ExtraFieldView.as_view(), name='extrafields-detail'),
    path('get/token/', ObtainAuthToken.as_view(), name='token_obtain'),
    path('get/google/token/', MyAPIView.as_view(), name='token_google'),
    path('get/<slug:slug>', get_user, name='get-user'),

    path('icons/', IconView.as_view(), name='icon-list'),
]


