# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0008_auto_20160621_1524'),
    ]

    operations = [
        migrations.CreateModel(
            name='AntennaRootCaused',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'antenna_root_cause_id')),
                ('antenna_root_caused', models.CharField(max_length=200, null=True, db_column=b'antenna_root_caused')),
            ],
            options={
                'db_table': 'antenna_root_caused',
            },
        ),
        migrations.CreateModel(
            name='OutageCategories',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'outage_categories_id')),
                ('outage_categories', models.CharField(max_length=200, null=True, db_column=b'outage_categories')),
            ],
            options={
                'db_table': 'outage_categories',
            },
        ),
        migrations.AddField(
            model_name='ninjausers',
            name='admin',
            field=models.CharField(default=b'N', max_length=1),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_cm_error',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_cm_error'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_insuff_qam_error',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_insuff_qam_error'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_network_error',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_network_error'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_qam_error',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_qam_error'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_root_cause',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_root_cause'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='antenna_tune_error',
            field=models.IntegerField(default=None, null=True, db_column=b'antenna_tune_error'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='hardened_check',
            field=models.CharField(default=None, max_length=1, null=True, db_column=b'hardened_check'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='mitigate_check',
            field=models.CharField(default=None, max_length=1, null=True, db_column=b'mitigate_check'),
        ),
        migrations.AddField(
            model_name='tickets',
            name='outage_categories',
            field=models.IntegerField(default=None, null=True, db_column=b'outage_categories'),
        ),
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 8, 11, 18, 36, 41, 653650)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=b'2016-08-11T18:36:41.656769+00:00'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=b'2016-08-11T18:36:41.656799+00:00'),
        ),
    ]
