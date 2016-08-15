# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0009_auto_20160811_1836'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 8, 12, 3, 31, 10, 270200)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='antenna_cm_error',
            field=models.IntegerField(default=0, null=True, db_column=b'antenna_cm_error'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='antenna_insuff_qam_error',
            field=models.IntegerField(default=0, null=True, db_column=b'antenna_insuff_qam_error'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='antenna_network_error',
            field=models.IntegerField(default=0, null=True, db_column=b'antenna_network_error'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='antenna_qam_error',
            field=models.IntegerField(default=0, null=True, db_column=b'antenna_qam_error'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='antenna_tune_error',
            field=models.IntegerField(default=0, null=True, db_column=b'antenna_tune_error'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='hardened_check',
            field=models.CharField(default=b'N', max_length=1, null=True, db_column=b'hardened_check'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='mitigate_check',
            field=models.CharField(default=b'N', max_length=1, null=True, db_column=b'mitigate_check'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=b'2016-08-12T03:31:10.273532+00:00'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=b'2016-08-12T03:31:10.273565+00:00'),
        ),
    ]
