from django.db import models
import uuid
from datetime import datetime
from json import JSONEncoder
from uuid import UUID


JSONEncoder_olddefault = JSONEncoder.default


def JSONEncoder_newdefault(self, o):
	if isinstance(o, UUID):
		return str(o)
	return JSONEncoder_olddefault(self, o)
JSONEncoder.default = JSONEncoder_newdefault


class Division(models.Model):
	ID = models.AutoField(primary_key=True,db_column='division_id')
	division_name = models.CharField(db_column='division_name',max_length=200)
	class Meta:
		db_table = 'division'


class Pg(models.Model):
	ID = models.AutoField(primary_key=True,db_column='pg_id')
	pg_cd = models.CharField(db_column='pg_cd',max_length=200)
	class Meta:
		db_table = 'pg'


class Duration(models.Model):
	ID = models.AutoField(primary_key=True, db_column='duration_id')
	duration = models.CharField(db_column='duration',max_length=200)
	class Meta:
		db_table = 'duration'


class ErrorCount(models.Model):
	ID = models.AutoField(primary_key=True, db_column='error_count_id')
	error = models.CharField(db_column='error',max_length=200)
	class Meta:
		db_table = 'error_count'


class OutageCaused(models.Model):
	ID = models.AutoField(primary_key=True, db_column='outage_caused_id')
	outage_caused = models.CharField(db_column='outage_caused',max_length=200)
	class Meta:
		db_table = 'outage_caused'


class SystemCaused(models.Model):
	ID = models.AutoField(primary_key=True, db_column='system_caused_id')
	system_caused = models.CharField(db_column='system_caused',max_length=200)
	class Meta:
		db_table = 'system_caused'


class Tickets(models.Model):
	#ID = models.UUIDField(primary_key=True, default=uuid.uuid4,
	#                      editable=False, db_column='ticket_id')
	ticket_num = models.CharField(max_length=100, db_column='ticket_num',primary_key=True)
	
	#divisions = models.ManyToManyField(Division,db_column='division_id')
	division = models.IntegerField(db_column='division_id')
	pgs = models.ManyToManyField(Pg)
	duration = models.IntegerField(db_column='duration_id')
	error_count = models.IntegerField(db_column='error_count_id')
	outage_caused = models.IntegerField(db_column='outage_caused_id')
	system_caused = models.IntegerField(db_column='system_caused_id')
	ticket_type = models.CharField(max_length=20, db_column='ticket_type',db_index=True)
	row_create_ts = models.DateTimeField(default=datetime.now())
	row_update_ts = models.DateTimeField(default=datetime.now())
	row_end_ts = models.DateTimeField(
		default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts')
	create_user_id = models.CharField(max_length=50, db_column='crt_user_id',null=True)
	update_user_id = models.CharField(max_length=50, db_column='upd_user_id',null=True)

	class Meta:
		db_table = 'tickets'

class AddtNotes(models.Model):
	Id = models.OneToOneField(
		Tickets,
		primary_key=True,
		db_column='notes_id'
	)
	notes = models.TextField()
	class Meta:
		db_table = 'addt_notes'

	def save(self, *args,**kwargs):
		if self.notes is None:
			self.notes = ""
		super(AddtNotes,self).save(*args,**kwargs)




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
