from django.db import models

import uuid
#from cassandra.cqlengine import columns
#from cassandra.cqlengine import connection
from datetime import datetime
from json import JSONEncoder
from uuid import UUID

#from cassandra.cqlengine.management import sync_table
#from cassandra.cqlengine.models import Model

JSONEncoder_olddefault = JSONEncoder.default


def JSONEncoder_newdefault(self, o):
    if isinstance(o, UUID):
        return str(o)
    return JSONEncoder_olddefault(self, o)
JSONEncoder.default = JSONEncoder_newdefault


class Tickets(models.Model):
    ID = models.UUIDField(primary_key=True, default=uuid.uuid4,
                          editable=False, db_column='ticket_id')
    created_dt = models.DateTimeField(db_column='created_dt')
    division = models.CharField(max_length=100, db_column='division')
    pg = models.CharField(max_length=5, db_column='pg')
    duration = models.CharField(max_length=100, db_column='duration')
    error_count = models.CharField(max_length=100, db_column='error_count')
    outage_caused = models.CharField(max_length=100, db_column='outage_caused')
    system_caused = models.CharField(max_length=100, db_column='system_caused')
    addt_notes = models.CharField(max_length=1000, db_column='addt_notes')
    ticket_num = models.CharField(max_length=100, db_column='ticket_num')
    ticket_type = models.CharField(max_length=20, db_column='ticket_type')
    row_create_ts = models.DateTimeField(default=datetime.now())
    row_end_ts = models.DateTimeField(
        default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts')

    class Meta:
        db_table = 'tickets'

    def save(self, *args,**kwargs):
    	if self.addt_notes is None:
    		self.addt_notes = ""
    	super(Tickets,self).save(*args,**kwargs)

# class Tickets(Model):
# 	ID = columns.UUIDField(primary_key=True, default=uuid.uuid4,
#                           editable=False, db_column='ticket_id')
#     created_dt = columns.DateTimeField(db_column='created_dt')
#     division = columns.Text()
#     pg = columns.Text()
#     duration = columns.Text()
#     error_count = columns.Text()
#     outage_caused = columns.Text()
#     system_caused = columns.Text()
#     addt_notes = columns.Text()
#     ticket_num = columns.Text()
#     ticket_type = columns.Text()
#     row_create_ts = columns.DateTime(default=datetime.datetime.now())
#     row_end_ts = columns.DateTimeField(
#         default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts')
