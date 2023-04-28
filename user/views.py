import glob
from jinja2 import Environment, FileSystemLoader
import os
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
from rest_framework import viewsets
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ExtraField
from .serializers import *
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from .serializers import ExtraFieldSerializer
from django.utils.text import slugify


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
            return redirect('home')
        else:
            mp.error(request, "Username or password incorrect")

    return render(request, 'users/login-section.html')




def user_signup(request):
    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():


            user = form.save(commit = False)
            # user.username = form.email
            user.backend = 'django.contrib.auth.backends.ModelBackend'  # set the backend attribute
            user.save()

            slug  = slugify(user.full_name.lower())

            user_profile = Profile(user = user,  name=user.full_name, slug = slug)
            user_profile.save()

            token, created = Token.objects.get_or_create(user=user)
            request.session['env_token'] = token.key

            EmailId.objects.create(user=user, email_type='Personal', email_id = user.email)

            tokens = request.session.get('env_token', None)

            mp.success(request, "User account created")
            login(request, user)
            return redirect('home')
        else:
            for msg in form.error_messages:
                mp.error(request, f"{msg}: {form.error_messages[msg]}")
                print(msg)             

    context = {'form':form}

    return render(request, 'users/register-section.html', context)


# logout 
@login_required(login_url='user-login')
def logout_user(request):
    logout(request)
    mp.success(request, "Sign Out")
    return redirect('user-login')




def get_user(request, slug):
    profile = Profile.objects.filter(slug=slug)[0]
    user = profile.user
    phone_number = PhoneNumber.objects.filter(user=user)
    email_id = EmailId.objects.filter(user=user)
    context = {
        'profile': profile,
        'phone': phone_number,
        'email': email_id
    }

    template_dir = os.path.join(settings.BASE_DIR, 'templates', 'cards')

    env = Environment(loader=FileSystemLoader(template_dir))
    template_files = glob.glob(os.path.join(template_dir, 'template-*.html'))

    templates = []
    template_numbers = []
    # Render each template
    for template_file in template_files:
        template_number = int(os.path.basename(template_file).split('template-')[1].split('.')[0])
        print(template_number)

        template_name = 'cards/template-' + str(template_number) + '.html'

        templates.append(template_name)
        template_numbers.append(template_number)

    context['templates'] = templates
    context['template_numbers'] = template_numbers


    return render(request, 'users/get-user.html', context)



@login_required(login_url='user-login')
def update_card(request):
    
    # profile = Profile.objects.get(user=request.user)
    user = User.objects.get(pk=request.user.pk)
    profile = Profile.objects.get(user=user)
    form = ProfileForm(instance=profile)

    phone_number = PhoneNumber.objects.filter(user=user)
    email_id = EmailId.objects.filter(user=user)

    if request.method == 'POST':
        phone = request.POST.get('phone_number')
        email = request.POST.get('email_id')
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            first_number = PhoneNumber.objects.filter(user=user)[0]
            first_number.phone_number = phone
            first_number.save()            
            first_email = EmailId.objects.filter(user=user)[0]
            first_email.email_id = email
            first_email.save()            

            form.save()
                
    import qrcode
    # Generate QR code image
    data = f'http://127.0.0.1:8000/user/get/{user.username}'
    img = qrcode.make(data)

    # Save image to /media/qr directory
    filename = f'{user.username}.jpeg'
    save_path = os.path.join(settings.BASE_DIR, 'static', 'qr', filename)
    img.save(save_path)

    context = {
        'user': user,
        'profile': profile,
        'qr': img,
        'form': form,
        'phone': phone_number,
        'email': email_id
    }


    template_dir = os.path.join(settings.BASE_DIR, 'templates', 'cards')

    env = Environment(loader=FileSystemLoader(template_dir))
    template_files = glob.glob(os.path.join(template_dir, 'template-*.html'))

    templates = []
    template_numbers = []
    # Render each template
    for template_file in template_files:
        template_number = int(os.path.basename(template_file).split('template-')[1].split('.')[0])

        template_name = 'cards/template-' + str(template_number) + '.html'

        templates.append(template_name)
        template_numbers.append(template_number)

    context['templates'] = templates
    context['template_numbers'] = template_numbers

    

    return render(request, 'users/profile.html', context)


@login_required(login_url='user-login')
def change_template(request):
    
    # profile = Profile.objects.get(user=request.user)
    user = User.objects.get(pk=request.user.pk)
    profile = Profile.objects.get(user=user)
    form = ProfileForm(instance=profile)

    phone_number = PhoneNumber.objects.filter(user=user)
    email_id = EmailId.objects.filter(user=user)

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()


    context = {
        'user': user,
        'profile': profile,
        'form': form,
        'phone': phone_number,
        'email': email_id
    }


    template_dir = os.path.join(settings.BASE_DIR, 'templates', 'cards')

    env = Environment(loader=FileSystemLoader(template_dir))
    template_files = glob.glob(os.path.join(template_dir, 'template-*.html'))

    templates = []
    template_numbers = []
    # Render each template
    for template_file in template_files:
        template_number = int(os.path.basename(template_file).split('template-')[1].split('.')[0])

        template_name = 'cards/template-' + str(template_number) + '.html'

        templates.append(template_name)
        template_numbers.append(template_number)

    context['templates'] = templates
    context['template_numbers'] = template_numbers

    

    return render(request, 'users/change-template.html', context)





# user dashboard 
@login_required(login_url='user-login')
def home(request):

    profile = Profile.objects.get(user=request.user)
    form = ProfileForm(instance=profile)

    if request.method == 'POST':
        print('hello')
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            
            return redirect('update-card')


    if request.user.is_authenticated:
        if not profile.dp:
            social_account = SocialAccount.objects.get(user=request.user, provider='google')
            profile_picture_url = social_account.extra_data['picture']
            response = requests.get(profile_picture_url)
            content = ContentFile(response.content)
            filename = f"{request.user.username}.jpg"
            path = default_storage.save(f"dp/{filename}", content)
            profile.dp = path
            profile.name = social_account.extra_data['name']
            profile.save()
            context = {'user': request.user, 'profile':profile, 'form':form, }
            return render(request, 'users/home.html', context)


    context = {'user': request.user, 'profile':profile, 'form':form, }

    return render(request, 'users/card.html', context)








class ExtraFieldView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ExtraFieldSerializer(data=request.data)
        user = request.user
        request.data['user'] = user.id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        extra_fields = ExtraField.objects.filter(user=request.user)
        serializer = ExtraFieldSerializer(extra_fields, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        extra_field = ExtraField.objects.filter(user=request.user, id=id).first()
        if not extra_field:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ExtraFieldSerializer(extra_field, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        extra_field = ExtraField.objects.get(id=id)
        # if not extra_field:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        extra_field.delete()
        # return Response(status=status.HTTP_204_NO_CONTENT)


class ObtainAuthToken(APIView):
    """
    API view to obtain an authentication token for a user
    """

    def get(self, request):
        """
        Validate a user's credentials and return an authentication token
        """

        token = request.session.get('env_token')
        print(token)
        print('session storage')
        print('got access token')
        print(request.session.get('env_token'))
        return Response({'token': token})

        






class MyAPIView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request):
        # Retrieve the user's social account for Google
        social_account = request.user.socialaccount_set.filter(provider='google').first()

        
        if social_account:
            # Retrieve the access token from the social account

            token = Token.objects.get(user=social_account.user)
            print(token)
        
            return Response({'access_token': str(token), 'status':0})
        else:
            return Response({'error': 'No social account found for Google.', 'status': 1}, status=400)








class TemplateView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        user = request.user

        try:
            profile = Profile.objects.get(user=user)
            profile.template = data['template']
            profile.save()
            return Response({'success': True})
        except Profile.DoesNotExist:
            return Response({'success': False, 'message': 'Profile does not exist'})




class IconView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # def post(self, request):
    #     serializer = ExtraFieldSerializer(data=request.data)
    #     user = request.user
    #     request.data['user'] = user.id
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        icons = Icon.objects.all()
        serializer = IconSerializer(icons, many=True)
        return Response(serializer.data)

    # def put(self, request, id):
    #     extra_field = ExtraField.objects.filter(user=request.user, id=id).first()
    #     if not extra_field:
    #         return Response(status=status.HTTP_404_NOT_FOUND)
    #     serializer = ExtraFieldSerializer(extra_field, data=request.data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    # def delete(self, request, id):
    #     extra_field = ExtraField.objects.get(id=id)
    #     # if not extra_field:
    #     #     return Response(status=status.HTTP_404_NOT_FOUND)
    #     extra_field.delete()
    #     # return Response(status=status.HTTP_204_NO_CONTENT)













    
class PhoneView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PhoneFieldSerializer(data=request.data)
        user = request.user
        request.data['user'] = user.id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        phone_number = PhoneNumber.objects.filter(user=request.user)
        serializer = PhoneFieldSerializer(phone_number, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        phone_number = PhoneNumber.objects.filter(user=request.user, id=id).first()
        if not phone_number:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PhoneFieldSerializer(phone_number, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        phone_number = PhoneNumber.objects.get(id=id)
        # if not phone_number:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        phone_number.delete()
        # return Response(status=status.HTTP_204_NO_CONTENT)






    
class EmailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EmailFieldSerializer(data=request.data)
        user = request.user
        request.data['user'] = user.id
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        email_id = EmailId.objects.filter(user=request.user)
        serializer = EmailFieldSerializer(email_id, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        email_id = EmailId.objects.filter(user=request.user, id=id).first()
        if not email_id:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = EmailFieldSerializer(email_id, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):
        email_id = EmailId.objects.get(id=id)
        # if not email_id:
        #     return Response(status=status.HTTP_404_NOT_FOUND)
        email_id.delete()
        # return Response(status=status.HTTP_204_NO_CONTENT)
