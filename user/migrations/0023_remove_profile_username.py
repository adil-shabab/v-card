# Generated by Django 4.1.7 on 2023-04-07 10:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0022_alter_profile_bg_gradient'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='username',
        ),
    ]
