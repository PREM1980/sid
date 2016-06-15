import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {
	'date':'2016/06/13 23:22:00',
	'division': 'western',
	'duration':'15 - 30 minutes',
	'pg[]':["10101", "10102",],
	'error_count':'5,000 - 10,000',
	#'outage_caused':'Scheduled Maintenance',
	#'system_caused':'Capacity',
	'ticket_num':'http://comcast.com/premtest22',
	'ticket_type':'JIRA',
	'userid':'api',
	'addt_notes':'hello'
}
print payload
r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text