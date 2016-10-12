import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 
payload = {"division":"Northeast"
,"ticket_type":"TTS"
,"addt_notes":""
,"userid":"JROZEN200"
,"pg[]":["11301"]
,"duration":"30 - 60 minutes"
,"date":"2016-10-10T09:33:52-05:00"
,"outage_caused":"Non-Comcast System Outage"
,"system_caused":"Backoffice"
,"ticket_num":"SI017302823"
,"error_count":"less than 1,000"}

print payload
# r = requests.post('http://localhost:8000/post-ticket-data',headers=headers,data=payload)
# r = requests.post('https://sid.comcast.net/post-ticket-data',headers=headers,data=payload, verify=False)

print 'status_code == ', r.status_code
print r.text


# import requests
# import json
# headers =  {
#        "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
#     } 
 
# payload = {
# #2016-07-18T12:07:00-04:00
# 'date':'2016-07-22T04:16:13-07:00',#
# 'division': 'westerN',
# 'duration':'15 - 30 minutes',
# 'pg[]':["10101", "10102",],
# 'error_count':'5,000 - 10,000',
# 'outage_caused':'',
# 'system_caused':'',
# 'ticket_num':'SI016764047',
# 'ticket_type':'JIRA',
# 'userid':'plaksh007c',
# # 'addt_notes':'hello'
# }
# print payload
# r = requests.post('https://sid.comcast.net/post-ticket-data',headers=headers,data=payload, verify=False)
 
# print r.status_code
# print r.text

