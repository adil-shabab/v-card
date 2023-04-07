from django import forms

from .models import Profile
from django.forms import ModelForm, fields
from django.contrib.auth.models import User
from django.forms import ModelForm, fields, TextInput, ImageField, IntegerField
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    full_name = forms.CharField(max_length=100, required=True)
    email = forms.EmailField(required=True)
    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput,
    )
    password2 = forms.CharField(
        label="Password confirmation",
        widget=forms.PasswordInput,
        help_text="Enter the same password as above, for verification.",
    )

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data['email']
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with that email address already exists.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.full_name = self.cleaned_data['full_name']
        if commit:
            user.save()
        return user


class ProfileForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['qr_status','bg_gradient','whatsapp','bg','color','company', 'address', 'vedio', 'designation' ,'location', 'name', 'bio', 'dp', 'coverimage', 'facebook', 'twitter', 'instagram', 'linkedin', 'website']


        widgets = {
            # 'location' : TextInput(attrs={'required':''}),
            # 'email' : TextInput(attrs={'required':''}),
            # 'phone_number' : TextInput(attrs={'required':''}),
            'name' : TextInput(attrs={'required':''}),
        }

    # def __init__(self, *args, **kwargs):
    #     super(ProfileForm, self).__init__(*args, **kwargs)
    #     self.fields['email'].required = True