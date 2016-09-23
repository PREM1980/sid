# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0010_auto_20160812_0331'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ams',
            fields=[
                ('ticket_num', models.CharField(max_length=100, serialize=False, primary_key=True, db_column=b'ticket_num')),
                ('url', models.TextField(default=b'', db_column=b'url')),
                ('brouha', models.TextField(default=b'', db_column=b'brouha')),
                ('action', models.TextField(default=b'', db_column=b'action')),
                ('last_action_before_clear', models.TextField(default=b'', db_column=b'last_action_before_clear')),
                ('resolve_close_reason', models.TextField(default=b'', db_column=b'resolve_close_reason')),
                ('in_process', models.TextField(default=b'', db_column=b'in_process')),
                ('chronic', models.TextField(default=b'', db_column=b'chronic')),
                ('service_affecting', models.TextField(default=b'', db_column=b'service_affecting')),
                ('from_dt', models.DateTimeField(default=b'', db_column=b'from_dt')),
                ('from_dt_am_pm', models.CharField(default=b'', max_length=2, db_column=b'from_dt_am_pm')),
                ('till_dt', models.DateTimeField(default=b'', db_column=b'till_dt')),
                ('till_dt_am_pm', models.CharField(default=b'', max_length=2, db_column=b'till_dt_am_pm')),
                ('duration', models.IntegerField(db_column=b'duration')),
                ('customers', models.IntegerField(db_column=b'customers')),
                ('stbs', models.IntegerField(db_column=b'stbs')),
                ('tta', models.IntegerField(db_column=b'tta')),
                ('tti', models.IntegerField(db_column=b'tti')),
                ('tts', models.IntegerField(db_column=b'tts')),
                ('ttr', models.IntegerField(db_column=b'ttr')),
                ('created_by', models.TextField(default=b'', db_column=b'created_by')),
                ('division', models.TextField(default=b'', db_column=b'division')),
                ('region', models.TextField(default=b'', db_column=b'region')),
                ('dac', models.TextField(default=b'', db_column=b'dac')),
                ('device', models.TextField(default=b'', db_column=b'device')),
                ('ip', models.TextField(default=b'', db_column=b'ip')),
                ('upstreams', models.TextField(default=b'', db_column=b'upstreams')),
                ('reason', models.TextField(default=b'', db_column=b'reason')),
                ('comment', models.BinaryField(default=b'', db_column=b'comment')),
                ('root_cause', models.TextField(default=b'', db_column=b'root_cause')),
                ('corrective_action_taken', models.TextField(default=b'', db_column=b'corrective_action_taken')),
                ('si_ticket', models.TextField(default=b'', db_column=b'si_ticket')),
                ('jb_ticket', models.TextField(default=b'', db_column=b'jb_ticket')),
                ('found_in_support_system', models.TextField(default=b'', db_column=b'found_in_support_system')),
                ('alert_event_text', models.TextField(default=b'', db_column=b'alert_event_text')),
                ('alert_type', models.TextField(default=b'', db_column=b'alert_type')),
                ('row_create_ts', models.DateTimeField(default=b'2016-09-23T20:54:43.210514+00:00')),
                ('row_update_ts', models.DateTimeField(default=b'2016-09-23T20:54:43.210538+00:00')),
                ('row_end_ts', models.DateTimeField(default=b'9999-12-31 00:00:00.00000-00', db_column=b'row_end_ts')),
                ('create_user_id', models.CharField(max_length=50, null=True, db_column=b'crt_user_id')),
                ('update_user_id', models.CharField(max_length=50, null=True, db_column=b'upd_user_id')),
                ('valid_flag', models.CharField(default=b'Y', max_length=1, db_column=b'valid_flag')),
            ],
            options={
                'db_table': 'ams_tickets',
            },
        ),
        migrations.AlterField(
            model_name='ninjausers',
            name='row_create_ts',
            field=models.DateTimeField(default=datetime.datetime(2016, 9, 23, 20, 54, 43, 205073)),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_create_ts',
            field=models.DateTimeField(default=b'2016-09-23T20:54:43.208309+00:00'),
        ),
        migrations.AlterField(
            model_name='tickets',
            name='row_update_ts',
            field=models.DateTimeField(default=b'2016-09-23T20:54:43.208339+00:00'),
        ),
    ]
