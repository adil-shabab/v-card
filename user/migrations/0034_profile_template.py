# Generated by Django 4.1.7 on 2023-04-13 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0033_alter_extrafield_icon'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='template',
            field=models.IntegerField(default=1),
        ),
    ]
