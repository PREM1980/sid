import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 

payload = {
			#2016-07-18T12:07:00-04:00
	'date':'2016-07-22T04:16:13-07:00',#
	'division': 'westerN',
	'duration':'15 - 30 minutes',
	'pg[]':["10101", "10102",],
	'error_count':'5,000 - 10,000',
	'outage_caused':'',
	'system_caused':'',
	'ticket_num':'test12',
	'ticket_type':'JIRA',
	'userid':'plaksh007c',
	# 'addt_notes':'hello'
}
print payload
# r = requests.get('http://localhost:8000/get-ticket-data',headers=headers,data=payload)
# r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)
r = requests.post('https://sid.comcast.net/post-ticket-data',headers=headers,data=payload, verify=False)

print r.status_code
print r.text