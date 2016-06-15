import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
# payload = {
# 	'ticket_num':'http://comcast.com/premtest7',
# 	'update_end_dt':'Y'
# }

# print payload
# r = requests.post('http://localhost:8000/update-ticket-data',headers=headers,data=payload)

# print r.status_code
# print r.text


payload = {
	#'created_dt':'2016/06/13 23:20:00',
	#'created_dt':'',
	'division': 'National',
	# 'duration':'15 - 30 minutes',
	'pg[]':["10201"],
	'error_count':'5,000 - 10,000',
	'outage_caused':'Scheduled Maintenance',
	'system_caused':'Backoffice',
	'ticket_num':'http://comcast.com/premtest22',
	'ticket_type':'JIRA',
	'userid':'api'
}
print payload
r = requests.post('http://localhost:8000/update-ticket-data',headers=headers,data=payload)

print r.status_code
print r.text