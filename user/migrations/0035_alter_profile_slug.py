# Generated by Django 4.1.7 on 2023-04-29 05:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0034_profile_template'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='slug',
            field=models.SlugField(blank=True, null=True, unique=True),
        ),
    ]
