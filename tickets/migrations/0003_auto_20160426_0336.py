# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0002_auto_20160404_1414'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickets',
            name='ticket_link',
            field=models.TextField(default=b''),
        ),
        migrations.AddField(
            model_name='tickets',
            name='valid_flag',
            field=models.CharField(default=b'Y', max_length=1, db_column=b'valid_flag'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 3, 36, 1, 874900)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 3, 36, 1, 874922)),
        ),
    ]
