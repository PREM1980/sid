# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0004_auto_20160426_0336'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickets',
            name='timezone',
            field=models.CharField(default=b'', max_length=50, db_column=b'timezone'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 5, 8, 40, 21199)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 4, 26, 5, 8, 40, 21219)),
        ),
    ]
