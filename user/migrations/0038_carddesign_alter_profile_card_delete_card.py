# Generated by Django 4.1.7 on 2023-04-29 09:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0037_remove_card_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='CardDesign',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('front', models.ImageField(upload_to='cards/')),
                ('back', models.ImageField(upload_to='cards/')),
            ],
        ),
        migrations.AlterField(
            model_name='profile',
            name='card',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='user.carddesign'),
        ),
        migrations.DeleteModel(
            name='Card',
        ),
    ]
