# Generated by Django 3.0 on 2021-07-10 01:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Myapp', '0002_db_home_href'),
    ]

    operations = [
        migrations.CreateModel(
            name='DB_project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, null=True)),
                ('remark', models.CharField(max_length=1000, null=True)),
                ('user', models.CharField(max_length=15, null=True)),
                ('other_user', models.CharField(max_length=200, null=True)),
            ],
        ),
    ]
