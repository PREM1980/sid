import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {
	'date':'2016/06/13 23:22:00',
	'division': 'westerN',
	'duration':'',
	'pg[]':["10101", "10102",],
	'error_count':'',
	'outage_caused':'',
	'system_caused':'',
	'ticket_num':'tkt-4',
	'ticket_type':'JIRA',
	'userid':'api',
	'addt_notes':'hello'
}
print payload

r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)
# r = requests.post('http://ninja.comcast.net/post-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text