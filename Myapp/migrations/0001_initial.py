# Generated by Django 3.0 on 2021-07-09 09:47

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DB_tucao',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=30, null=True)),
                ('text', models.CharField(max_length=1000, null=True)),
                ('ctime', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
