# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickets',
            name='create_user_id',
            field=models.CharField(max_length=50, null=True, db_column=b'crt_user_id'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='update_user_id',
            field=models.CharField(max_length=50, null=True, db_column=b'upd_user_id'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 4, 14, 14, 4, 114153)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 4, 14, 14, 4, 114174)),
        ),
    ]
