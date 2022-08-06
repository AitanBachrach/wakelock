# Generated by Django 4.0.6 on 2022-08-05 08:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cardpicker", "0024_rename_drive_id_to_identifier"),
    ]

    operations = [
        migrations.AddField(
            model_name="card",
            name="folder_location",
            field=models.CharField(default="", max_length=300),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="cardback",
            name="folder_location",
            field=models.CharField(default="", max_length=300),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="token",
            name="folder_location",
            field=models.CharField(default="", max_length=300),
            preserve_default=False,
        ),
    ]
