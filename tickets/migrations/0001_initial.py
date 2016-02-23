# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import uuid


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tickets',
            fields=[
                ('ID', models.UUIDField(primary_key=True, db_column=b'ticket_id', default=uuid.uuid4, serialize=False, editable=False)),
                ('created_dt', models.DateTimeField(db_column=b'created_dt')),
                ('division', models.CharField(max_length=100, db_column=b'division')),
                ('pg', models.CharField(max_length=5, db_column=b'pg')),
                ('duration', models.CharField(max_length=100, db_column=b'duration')),
                ('error_count', models.CharField(max_length=100, db_column=b'error_count')),
                ('outage_caused', models.CharField(max_length=100, db_column=b'outage_caused')),
                ('system_caused', models.CharField(max_length=100, db_column=b'system_caused')),
                ('addt_notes', models.CharField(max_length=1000, db_column=b'addt_notes')),
                ('ticket_num', models.CharField(max_length=100, db_column=b'ticket_num')),
                ('ticket_type', models.CharField(max_length=20, db_column=b'ticket_type')),
                ('row_create_ts', models.DateTimeField(default=datetime.datetime(2016, 2, 19, 19, 38, 35, 685842))),
                ('row_end_ts', models.DateTimeField(default=b'9999-12-31 00:00:00.00000-00', db_column=b'row_end_ts')),
            ],
            options={
                'db_table': 'tickets',
            },
        ),
    ]
