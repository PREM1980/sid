# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0005_auto_20160426_0508'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickets',
            name='timezone_offset',
            field=models.CharField(default=b'', max_length=50, db_column=b'timezone_offset'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 22, 56, 8, 912892)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 22, 56, 8, 912922)),
        ),
    ]
