# Generated by Django 4.1.7 on 2023-04-13 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0025_remove_extrafield_icon_extrafield_icon'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='extrafield',
            name='icon',
        ),
        migrations.AddField(
            model_name='extrafield',
            name='icons',
            field=models.ManyToManyField(blank=True, to='user.icon'),
        ),
    ]
