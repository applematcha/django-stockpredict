# Generated by Django 2.2.1 on 2020-03-30 14:05

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userAccount', models.CharField(max_length=20, unique=True)),
                ('userPasswd', models.CharField(max_length=20)),
                ('userName', models.CharField(max_length=20)),
                ('userPhone', models.CharField(max_length=20)),
                ('userAdderss', models.CharField(max_length=100)),
                ('userImg', models.CharField(max_length=150)),
                ('userRank', models.IntegerField()),
                ('userToken', models.CharField(max_length=50)),
            ],
        ),
    ]
