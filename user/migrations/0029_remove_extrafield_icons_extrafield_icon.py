# Generated by Django 4.1.7 on 2023-04-13 06:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0028_alter_extrafield_icons'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='extrafield',
            name='icons',
        ),
        migrations.AddField(
            model_name='extrafield',
            name='icon',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='user.icon'),
        ),
    ]