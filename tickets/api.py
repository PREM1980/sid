	import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {
	'start_date_s':'04/01/2016',
	'start_date_e':'04/15/2016',
	'duration':'15 - 30 minutes',
	'pg[]':["10204", "10101", "10201", "10203", "10102", "10202"],
	'error_count':'5,000 - 10,000',
	'outage_caused':'Scheduled Maintenance',
	'system_caused':'Capacity',
	'ticket_num':'vpsq-1235'
}
print payload
#r = requests.post('http://localhost:8000/get-ticket-data',headers=headers,data=payload)
r = requests.post('http://ninja.comcast.net/get-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text

