# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Division',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'division_id')),
                ('division_name', models.CharField(max_length=200, db_column=b'division_name')),
            ],
            options={
                'db_table': 'division',
            },
        ),
        migrations.CreateModel(
            name='Duration',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'duration_id')),
                ('duration', models.CharField(max_length=200, db_column=b'duration')),
            ],
            options={
                'db_table': 'duration',
            },
        ),
        migrations.CreateModel(
            name='ErrorCount',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'error_count_id')),
                ('error', models.CharField(max_length=200, db_column=b'error')),
            ],
            options={
                'db_table': 'error_count',
            },
        ),
        migrations.CreateModel(
            name='OutageCaused',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'outage_caused_id')),
                ('outage_caused', models.CharField(max_length=200, db_column=b'outage_caused')),
            ],
            options={
                'db_table': 'outage_caused',
            },
        ),
        migrations.CreateModel(
            name='Pg',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'pg_id')),
                ('pg_cd', models.CharField(max_length=200, db_column=b'pg_cd')),
            ],
            options={
                'db_table': 'pg',
            },
        ),
        migrations.CreateModel(
            name='SystemCaused',
            fields=[
                ('ID', models.AutoField(serialize=False, primary_key=True, db_column=b'system_caused_id')),
                ('system_caused', models.CharField(max_length=200, db_column=b'system_caused')),
            ],
            options={
                'db_table': 'system_caused',
            },
        ),
        migrations.CreateModel(
            name='Tickets',
            fields=[
                ('ticket_num', models.CharField(max_length=100, serialize=False, primary_key=True, db_column=b'ticket_num')),
                ('division', models.IntegerField(db_column=b'division_id')),
                ('duration', models.IntegerField(db_column=b'duration_id')),
                ('error_count', models.IntegerField(db_column=b'error_count_id')),
                ('outage_caused', models.IntegerField(db_column=b'outage_caused_id')),
                ('system_caused', models.IntegerField(db_column=b'system_caused_id')),
                ('ticket_type', models.CharField(max_length=20, db_column=b'ticket_type', db_index=True)),
                ('row_create_ts', models.DateTimeField(default=datetime.datetime(2016, 3, 4, 20, 6, 6, 860541))),
                ('row_update_ts', models.DateTimeField(default=datetime.datetime(2016, 3, 4, 20, 6, 6, 860569))),
                ('row_end_ts', models.DateTimeField(default=b'9999-12-31 00:00:00.00000-00', db_column=b'row_end_ts')),
            ],
            options={
                'db_table': 'tickets',
            },
        ),
        migrations.CreateModel(
            name='AddtNotes',
            fields=[
                ('Id', models.OneToOneField(primary_key=True, db_column=b'notes_id', serialize=False, to='tickets.Tickets')),
                ('notes', models.TextField()),
            ],
            options={
                'db_table': 'addt_notes',
            },
        ),
        migrations.AddField(
            model_name='tickets',
            name='pgs',
            field=models.ManyToManyField(to='tickets.Pg'),
        ),
    ]
