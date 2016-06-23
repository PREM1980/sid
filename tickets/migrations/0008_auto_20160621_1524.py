# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0007_auto_20160608_0330'),
    ]

    operations = [
        migrations.AddField(
            model_name='errorcount',
            name='error_count_actuals',
            field=models.IntegerField(default=0, db_column=b'error_actuals'),
        ),
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 21, 15, 24, 40, 139014)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 21, 15, 24, 40, 141588)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 21, 15, 24, 40, 141610)),
        ),
    ]
