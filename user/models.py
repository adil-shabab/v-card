from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE, SET_NULL




class Icon(models.Model):
    icon_html = models.CharField(max_length=100)

    def __str__(self):
        return self.icon_html



class ExtraField(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=180)
    is_social = models.BooleanField(default=False)

    icon = models.OneToOneField(Icon, on_delete=models.CASCADE, null=True, blank=True)


class PhoneNumber(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_type = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=12)


class EmailId(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email_type = models.CharField(max_length=150, null=True, blank=True)
    email_id = models.EmailField()









class Profile(models.Model):
    slug = models.SlugField(unique=True, editable=False, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    # email = models.EmailField(max_length=200, blank=True, null=True)
    bio= models.TextField(blank=True, null=True)
    address= models.TextField(blank=True, null=True)
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
    # phone_number = models.CharField(max_length=12, null=True, blank=True)

    whatsapp = models.CharField(max_length=12, null=True, blank=True)
    company = models.CharField(max_length=150, null=True, blank=True)
    designation = models.CharField(max_length=150, null=True, blank=True)
    
    vedio = models.CharField(max_length=250, null=True, blank=True)



    def __str__(self):
        return str(self.user.username)