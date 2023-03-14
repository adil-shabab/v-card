from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE, SET_NULL




class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(max_length=200, blank=True, null=True)
    bio= models.TextField(blank=True, null=True)
    dp = models.ImageField(blank=True, null=True, upload_to= 'dp/', default="dp/default.png")
    coverimage = models.ImageField(blank=True, null=True, upload_to= 'cover/', default="cover/default.jpg")
    location = models.CharField(max_length=200, blank=True, null=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    facebook = models.CharField(max_length=200, blank=True, null=True)
    linkedin = models.CharField(max_length=200, blank=True, null=True)
    twitter = models.CharField(max_length=200, blank=True, null=True)
    instagram = models.CharField(max_length=200, blank=True, null=True)
    website = models.CharField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    phone_number = models.CharField(max_length=12, null=True, blank=True)

    def __str__(self):
        return str(self.user.username)