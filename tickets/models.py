from django.db import models
import uuid
from datetime import datetime
import pytz
from json import JSONEncoder
from uuid import UUID
from django.db.models.signals import pre_save
from django.dispatch import receiver


JSONEncoder_olddefault = JSONEncoder.default

def JSONEncoder_newdefault(self, o):
	if isinstance(o, UUID):
		return str(o)
	return JSONEncoder_olddefault(self, o)
JSONEncoder.default = JSONEncoder_newdefault


class NinjaUsers(models.Model):
	REGION_CHOICES = (
		('Central', 'Central'),
		('Northeast', 'Northeast'),
		('Western', 'Western'),
	)
	ID = models.AutoField(primary_key=True,db_column='user_id')
	fname = models.CharField(db_column='fname',max_length=200, default='')
	lname = models.CharField(db_column='lname',max_length=200, default='')
	userid = models.CharField(db_column='userid',max_length=200,default='')
	region = models.CharField(db_column='region',max_length=20,choices=REGION_CHOICES,default='Central')
	valid_flag = models.CharField(max_length=1,db_column='valid_flag',default="Y")
	admin = models.CharField(max_length=1,default='N')
	row_create_ts = models.DateTimeField(default=datetime.now())
	class Meta:
		db_table = 'ninjausers'

	def __unicode__(self):
		return 'First Name : ' + self.fname + ' Last Name : ' + self.lname

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
	error_count_actuals = models.IntegerField(db_column='error_actuals',default=0)
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

class AntennaRootCaused(models.Model):
	ID = models.AutoField(primary_key=True, db_column='antenna_root_cause_id')
	antenna_root_caused = models.CharField(db_column='antenna_root_caused',max_length=200,null=True)
	class Meta:
		db_table = 'antenna_root_caused'

class OutageCategories(models.Model):
	ID = models.AutoField(primary_key=True, db_column='outage_categories_id')
	outage_categories = models.CharField(db_column='outage_categories',max_length=200,null=True)
	class Meta:
		db_table = 'outage_categories'


class Tickets(models.Model):	
	ticket_num = models.CharField(max_length=100, db_column='ticket_num',primary_key=True)
	ticket_link = models.TextField(default="")
	#divisions = models.ManyToManyField(Division,db_column='division_id')
	division = models.IntegerField(db_column='division_id')
	pgs = models.ManyToManyField(Pg)
	duration = models.IntegerField(db_column='duration_id')
	error_count = models.IntegerField(db_column='error_count_id')
	# error_count_actuals = models.IntegerField(db_column='error_count_actuals')
	outage_caused = models.IntegerField(db_column='outage_caused_id')
	system_caused = models.IntegerField(db_column='system_caused_id')
	ticket_type = models.CharField(max_length=20, db_column='ticket_type',db_index=True)
	row_create_ts = models.DateTimeField(default=datetime.now(tz=pytz.utc).isoformat())
	row_update_ts = models.DateTimeField(default=datetime.now(tz=pytz.utc).isoformat())
	antenna_root_cause 		 = models.IntegerField(db_column='antenna_root_cause',default=None,null=True)
	outage_categories 		 = models.IntegerField(db_column='outage_categories',default=None,null=True)
	mitigate_check 			 = models.CharField(max_length=1, db_column='mitigate_check',default='N',null=True)
	hardened_check			 = models.CharField(max_length=1, db_column='hardened_check',default='N',null=True)
	antenna_tune_error 		 = models.IntegerField(db_column='antenna_tune_error',default=0,null=True)	
	antenna_qam_error 		 = models.IntegerField(db_column='antenna_qam_error',default=0,null=True)	
	antenna_network_error 	 = models.IntegerField(db_column='antenna_network_error',default=0,null=True)	
	antenna_insuff_qam_error = models.IntegerField(db_column='antenna_insuff_qam_error',default=0,null=True)	
	antenna_cm_error 		 = models.IntegerField(db_column='antenna_cm_error',default=0,null=True)	
	
	row_end_ts = models.DateTimeField(
		default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts')
	# row_end_ts_utc = models.DateTimeField(
	# 	default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts_utc')
	create_user_id = models.CharField(max_length=50, db_column='crt_user_id',null=True)
	update_user_id = models.CharField(max_length=50, db_column='upd_user_id',null=True)
	valid_flag = models.CharField(max_length=1,db_column='valid_flag',default="Y")
	timezone = models.CharField(max_length=50,db_column="timezone",default="")
	timezone_offset = models.CharField(max_length=50,db_column="timezone_offset",default="")

	class Meta:
		db_table = 'tickets'

	# def get_utc_ts(date)
	# 	return dateutil.parser.parse(date).utcnow()


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

class Ams(models.Model):	
	ticket_num = models.CharField(max_length=100, db_column='ticket_num',primary_key=True)
	url = models.TextField(default="",db_column='url')	
	brouha = models.TextField(default="",db_column='brouha')	
	action = models.TextField(default="",db_column='action')	
	last_action_before_clear = models.TextField(default="",db_column='last_action_before_clear')	
	resolve_close_reason = models.TextField(default="",db_column='resolve_close_reason')	
	in_process = models.TextField(default="",db_column='in_process')	
	chronic = models.TextField(default="",db_column='chronic')	
	service_affecting = models.TextField(default="",db_column='service_affecting')	
	from_dt = models.DateTimeField(default="",db_column='from_dt')	
	from_dt_am_pm = models.CharField(max_length=2,default="",db_column='from_dt_am_pm')	
	till_dt = models.DateTimeField(default="",db_column='till_dt')
	till_dt_am_pm = models.CharField(max_length=2,default="",db_column='till_dt_am_pm')
	duration = models.IntegerField(db_column='duration')
	customers = models.IntegerField(db_column='customers')
	stbs = models.IntegerField(db_column='stbs')
	tta = models.IntegerField(db_column='tta')
	tti = models.IntegerField(db_column='tti')
	tts = models.IntegerField(db_column='tts')
	ttr = models.IntegerField(db_column='ttr')
	created_by = models.TextField(default='',db_column='created_by')
	division = models.TextField(default='',db_column='division')
	region = models.TextField(default='',db_column='region')
	dac = models.TextField(default='',db_column='dac')
	device = models.TextField(default='',db_column='device')
	ip = models.TextField(default='',db_column='ip')
	upstreams = models.TextField(default='',db_column='upstreams')
	reason = models.TextField(default='',db_column='reason')
	comment = models.BinaryField(default='',db_column='comment')
	root_cause = models.TextField(default='',db_column='root_cause')
	corrective_action_taken = models.TextField(default='',db_column='corrective_action_taken')
	si_ticket = models.TextField(default='',db_column='si_ticket')
	jb_ticket = models.TextField(default='',db_column='jb_ticket')
	found_in_support_system = models.TextField(default='',db_column='found_in_support_system')
	alert_event_text = models.TextField(default='',db_column='alert_event_text')
	alert_type = models.TextField(default='',db_column='alert_type')
	row_create_ts = models.DateTimeField(default=datetime.now(tz=pytz.utc).isoformat())
	row_update_ts = models.DateTimeField(default=datetime.now(tz=pytz.utc).isoformat())
	row_end_ts = models.DateTimeField(
		default='9999-12-31 00:00:00.00000-00', db_column='row_end_ts')
	create_user_id = models.CharField(max_length=50, db_column='crt_user_id',null=True)
	update_user_id = models.CharField(max_length=50, db_column='upd_user_id',null=True)
	valid_flag = models.CharField(max_length=1,db_column='valid_flag',default="Y")
	
	class Meta:
		db_table = 'ams_tickets'

# @receiver(pre_save, sender=Tickets)
# def my_handler(sender, instance, *args, **kwargs):
# 	print 'instance.row_create_ts == ', instance.row_create_ts
# 	print 'instance.row_update_ts == ', instance.row_update_ts
# 	print 'instance.row_end_ts == ', instance.row_end_ts
# 	try:
# 		instance.row_create_ts = dateutil.parser.parse(instance.row_create_ts).utcnow()
# 		# instance.row_update_ts = dateutil.parser.parse(instance.row_update_ts).utcnow()
# 		# instance.row_end_ts = dateutil.parser.parse(instance.row_end_ts).utcnow()
# 	except Exception as e:
# 		print 'Exception == {0}'.format(e)
# 		raise ('Unable to convert the timestamp to UTC')


