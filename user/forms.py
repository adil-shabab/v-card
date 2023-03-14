
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
        fields = ['location', 'phone_number','name', 'email', 'username', 'bio', 'dp', 'coverimage', 'facebook', 'twitter', 'instagram', 'linkedin', 'website']


        # widgets = {
        #     'location' : TextInput(attrs={'required':'', 'placeholder': 'Location'}),
        #     'email' : TextInput(attrs={'required':'', 'placeholder': 'Email Address'}),
        #     'phone_number' : TextInput(attrs={'required':'', 'placeholder': 'Phone Number'}),
        #     'name' : TextInput(attrs={'required':'', 'placeholder': 'Full Name'}),
        #     'username' : TextInput(attrs={'required':'', 'placeholder': 'Username'}),
        #     'bio' : TextInput(attrs={'placeholder': 'Bio'}),
        #     'website' : TextInput(attrs={'placeholder': 'Website'}),
        #     'facebook' : TextInput(attrs={'placeholder': 'Facebook'}),
        #     'instagram' : TextInput(attrs={'placeholder': 'Instagram'}),
        #     'linkedin' : TextInput(attrs={'placeholder': 'Linkedin'}),
        #     'twitter' : TextInput(attrs={'placeholder': 'Twitter'}),
        # }

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.fields['email'].required = True
