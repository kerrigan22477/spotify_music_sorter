# Generated by Django 4.0.8 on 2022-11-30 21:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_room_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='sorting_criteria',
            field=models.CharField(default='key', max_length=20),
        ),
    ]
