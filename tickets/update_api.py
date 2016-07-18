import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 

#Update all other ticket details
payload = {
	'created_dt':'2016-07-18T12:07:00-04:00',
	'end_dt':'2016-07-18T12:07:00-04:00',
	#'division': 'National',
	'duration':'30 - 60 minutes',
	#'pg[]':["10201"],
	'error_count':'5,000 - 10,000',
	'outage_caused':'Scheduled Maintenance',
	'system_caused':'Backoffice',
	'ticket_num':'test10',
	'addt_notes':'This is test',
	'userid':'api' 
}
print payload
r = requests.post('http://localhost:8000/update-ticket-data',headers=headers,data=payload)
# r = requests.post('http://ninja.comcast.net/update-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text













#Update the end date alone(short version)
# payload = {
# 	'ticket_num':'http://comcast.com/premtest7',
# 	'update_end_dt':'Y'
# }
# r = requests.post('http://localhost:8000/update-ticket-data',headers=headers,data=payload)

# print r.status_code
# print r.text
