# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0006_auto_20160426_2256'),
    ]

    operations = [
        migrations.CreateModel(
            name='NinjaUsers',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'user_id')),
                ('fname', models.CharField(default=b'', max_length=200, db_column=b'fname')),
                ('lname', models.CharField(default=b'', max_length=200, db_column=b'lname')),
                ('userid', models.CharField(default=b'', max_length=200, db_column=b'userid')),
                ('region', models.CharField(default=b'Central', max_length=20, db_column=b'region', choices=[(b'Central', b'Central'), (b'Northeast', b'Northeast'), (b'Western', b'Western')])),
                ('valid_flag', models.CharField(default=b'Y', max_length=1, db_column=b'valid_flag')),
                ('row_create_ts', models.DateTimeField(default=datetime.datetime(2016, 6, 8, 3, 30, 28, 148131))),
            ],
            options={
                'db_table': 'ninjausers',
            },
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 8, 3, 30, 28, 150654)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 6, 8, 3, 30, 28, 150672)),
        ),
    ]
