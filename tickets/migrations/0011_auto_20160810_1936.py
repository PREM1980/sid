# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160716122224 on 2016-08-10 19:36
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0010_auto_20160810_1935'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 8, 10, 19, 36, 43, 823710)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=b'2016-08-10T19:36:43.826453+00:00'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=b'2016-08-10T19:36:43.826487+00:00'),
        ),
    ]
