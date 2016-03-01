import uuid
from cqlengine import columns
from cqlengine.models import Model
from datetime import datetime
from cqlengine.management import sync_table
from cassandra.cluster import Cluster
from cassandra.query import BatchStatement, SimpleStatement


class Tickets(Model):
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(primary_key=True,default=datetime.now(),clustering_order='DESC')
	division = columns.Text()
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_Division(Model):
	division = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')
	
class Tickets_Pg(Model):
	pg = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	division = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_Duration(Model):
	duration = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	division = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')
	
class Tickets_Error_Count(Model):
	error_count = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	division = columns.Text()
	duration = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_Outage_Caused(Model):
	outage_caused = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_System_Caused(Model):
	system_caused = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	addt_notes = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_Ticket_Type(Model):
	ticket_type = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	addt_notes = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')

class Tickets_Addt_Notes(Model):
	addt_notes = columns.Text(primary_key=True)
	ticket_id = columns.Text(primary_key=True)
	created_dt = columns.DateTime(default=datetime.now())
	pg = columns.Text()
	duration = columns.Text()
	error_count = columns.Text()
	outage_caused = columns.Text()
	system_caused = columns.Text()
	ticket_type = columns.Text()
	row_create_ts = columns.DateTime(default=datetime.now())
	row_end_ts = columns.DateTime(
		default='9999-12-31 00:00:00.00000-00')


#connection.setup(['127.0.0.1'], "cqlengine", protocol_version=3)
#sync_table(Tickets)
from cqlengine import connection
connection.setup(["localhost"], "sid")
# sync_table(Tickets)
# sync_table(Tickets_Division)
# sync_table(Tickets_Duration)
# sync_table(Tickets_Pg)
# sync_table(Tickets_Error_Count)
# sync_table(Tickets_Outage_Caused)
# sync_table(Tickets_System_Caused)
# sync_table(Tickets_Ticket_Type)
# sync_table(Tickets_Addt_Notes)

cluster = Cluster(['127.0.0.1'])
session = cluster.connect("sid")

# result = session.execute("select * from tickets ")
# print dir(result)
# for each in result:
# 	print each
import datetime

division = 'National'
pg = '1234'
duration = '1-15 minutes'
error_count = '1,000-5,000'
outage_caused = 'Scheduled Maintenance'
system_caused = 'BackOffice'
ticket_type = 'JIRA'
addt_notes = 'addt_notes'

curr_date_time = datetime.datetime.now()
tickets = {'ticket_id':'1234'
,'created_dt':curr_date_time
,'division':division
,'duration':duration
,'pg':pg
,'error_count':error_count
,'outage_caused':outage_caused
,'system_caused':system_caused
,'ticket_type':ticket_type
,'addt_notes':addt_notes
}

batch = BatchStatement()
#batch.add(SimpleStatement("INSERT INTO tickets (name, age) VALUES (%s, %s)"), (name, age))
batch.add(SimpleStatement("INSERT INTO tickets (ticket_id,created_dt, \
	division, \
	pg, \
	duration,\
	error_count, \
	outage_caused, \
	system_caused, \
	ticket_type, \
	addt_notes) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"), (tickets['ticket_id'], tickets['created_dt'],
	tickets['division'],tickets['pg'], tickets['duration'],tickets['error_count'], 
	tickets['outage_caused'], tickets['system_caused'],tickets['ticket_type'], tickets['addt_notes']))



#batch.add(SimpleStatement("DELETE FROM pending_users WHERE name=%s"), (name,))
session.execute(batch)


