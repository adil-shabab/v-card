# Generated by Django 4.1.7 on 2023-03-23 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0018_profile_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='vedio',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]
