import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {
	'date':'2016/07/05 23:22:00',#
	'division': 'westerN',
	'duration':'15 - 30 minutes',
	'pg[]':["10101", "10102",],
	'error_count':'5,000 - 10,000',
	'outage_caused':'',
	'system_caused':'',
	'ticket_num':'tkt-13',
	'ticket_type':'JIRA',
	'userid':'plaksh007c',
	# 'addt_notes':'hello'
}
print payload

r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)
#r = requests.post('http://ninja.comcast.net/post-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text