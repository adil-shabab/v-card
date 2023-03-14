
from .models import Profile
from django.forms import ModelForm, fields
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['email', 'username', 'password1', 'password2']
        labels = {
            'first_name': 'Name',
            'email': 'Email',
        }


class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['location', 'phone_number','name', 'email', 'username', 'bio', 'dp', 'coverimage', 'facebook', 'twitter', 'instagram', 'website']

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True
