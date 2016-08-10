# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160716122224 on 2016-08-10 18:51
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0008_auto_20160621_1524'),
    ]

    operations = [
        migrations.CreateModel(
            name='AntennaRootCause',
            fields=[
                ('ID', models.AutoField(db_column=b'antenna_root_cause_id', primary_key=True, serialize=False)),
                ('antenna_root_caused', models.CharField(db_column=b'antenna_root_caused', max_length=200)),
            ],
            options={
                'db_table': 'antenna_root_caused',
                'indexes': [],
            },
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_cm_error',
            field=models.IntegerField(db_column=b'antenna_cm_error', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_insuff_qam_error',
            field=models.IntegerField(db_column=b'antenna_insuff_qam_error', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_network_error',
            field=models.IntegerField(db_column=b'antenna_network_error', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_qam_error',
            field=models.IntegerField(db_column=b'antenna_qam_error', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_root_cause',
            field=models.IntegerField(db_column=b'antenna_root_cause', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_tune_error',
            field=models.IntegerField(db_column=b'antenna_tune_error', default=None),
        ),
        migrations.AddField(
            model_name='tickets',
            name='hardened_check',
            field=models.CharField(db_column=b'hardened_check', default=None, max_length=1),
        ),
        migrations.AddField(
            model_name='tickets',
            name='mitigate_check',
            field=models.CharField(db_column=b'mitigate_check', default=None, max_length=1),
        ),
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 8, 10, 18, 51, 15, 51688)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=b'2016-08-10T18:51:15.054416+00:00'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=b'2016-08-10T18:51:15.054449+00:00'),
        ),
    ]
