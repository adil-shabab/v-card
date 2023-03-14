from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages as mp
from .forms import *
from .models import *
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth.backends import ModelBackend
from allauth.socialaccount.models import SocialAccount
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Create your views here.

def user_login(request):
    if request.user.is_authenticated:
        return redirect ('home')

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            mp.error(request, "User does not exist")
            return render(request, 'users/signin.html')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            user.backend = 'django.contrib.auth.backends.ModelBackend' # set the backend attribute
            login(request, user)
            return redirect('profile')
        else:
            mp.error(request, "Username or password incorrect")

    return render(request, 'users/signin.html')




def user_signup(request):
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit = False)
            user.username = user.username.lower()
            user.backend = 'django.contrib.auth.backends.ModelBackend'  # set the backend attribute
            user.save()



            user_profile = Profile(user = user,username=user.username, email=user.email, name=user.username)
            user_profile.save()

            mp.success(request, "User account created")

            login(request, user)

            return redirect('home')
        else:
            for msg in form.error_messages:
                mp.error(request, f"{msg}: {form.error_messages[msg]}")
                print(msg)             

    context = {'form':form}

    return render(request, 'users/signup.html', context)


# logout 
@login_required(login_url='user-login')
def logout_user(request):
    logout(request)
    mp.success(request, "Sign Out")
    return redirect('user-login')



# user dashboard 
@login_required(login_url='user-login')
def home(request):


    profile = Profile.objects.get(user=request.user)
    if request.user.is_authenticated:
        if not profile.dp:
            social_account = SocialAccount.objects.get(user=request.user, provider='google')
            profile_picture_url = social_account.extra_data['picture']
            response = requests.get(profile_picture_url)
            content = ContentFile(response.content)
            filename = f"{request.user.username}.jpg"
            path = default_storage.save(f"dp/{filename}", content)
            profile.dp = path
            profile.save()


    context = {'user': request.user, 'profile':profile}

    return render(request, 'users/home.html', context)