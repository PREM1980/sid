import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {
	'date':'2016/04/01 00:00:00',
	'division': 'west',
	'duration':'15 - 30 minutes',
	'pg[]':["10101", "10102",],
	'error_count':'5,000 - 10,000',
	'outage_caused':'Scheduled Maintenance',
	'system_caused':'Capacity',
	'ticket_num':'http://comcast.com/prem1245',
	'ticket_type':'JIRA',
	'userid':'api'
}
print payload
r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text