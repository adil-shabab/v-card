from .models import Profile
from django.forms import ModelForm, fields
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.forms import ModelForm, fields, TextInput, ImageField, IntegerField



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
        fields = ['whatsapp','company', 'address', 'vedio', 'designation' ,'location', 'name', 'username', 'bio', 'dp', 'coverimage', 'facebook', 'twitter', 'instagram', 'linkedin', 'website']


        widgets = {
            'location' : TextInput(attrs={'required':''}),
            # 'email' : TextInput(attrs={'required':''}),
            # 'phone_number' : TextInput(attrs={'required':''}),
            'name' : TextInput(attrs={'required':''}),
            'username' : TextInput(attrs={'required':''}),
        }

    # def __init__(self, *args, **kwargs):
    #     super(ProfileForm, self).__init__(*args, **kwargs)
    #     self.fields['email'].required = True