import MySQLdb
db = MySQLdb.connect("localhost", "sid", "sid", "sid")

# prepare a cursor object using cursor() method
cursor = db.cursor()

# doc = {'system_caused': 'Backoffice', 'division': 'Central', 'addt_notes': 'a', 'pg': '10201', 'date': '2016/02/10 12:11:20',
#       'outage_caused': 'Scheduled Maintenance', 'ticket_num': '1234', 'ticket_type': 'JIRA', 'error_count': '1 - 15 minutes'}

# execute SQL query using execute() method.
cursor.execute("SELECT VERSION()")

# Fetch a single row using fetchone() method.
data = cursor.fetchone()

print "Database version : %s " % data

# disconnect from server
db.close()
