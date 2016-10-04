import requests
import json
headers =  {
       "AUTHORIZATION": "CPT74QBAWFIDFH4U27RT"
    } 

payload = {			
	'id':'prem1010'
	,'url':'http://alohamon.io.comcast.net/ticket/PREM1010'
	,'brouha':''
	,'action':'Resolved'
	,'last_action_before_clear':'Monitor'
	,'resolve_close_reason':'Cleared'
	,'in_process':'Y'
	,'chronic':'N'
	,'service_affecting':'Y'
	,'from_dt':'7/18/16 15:41'
	,'till_dt':'7/18/16 15:41'
	,'duration':1248
	,'customers':285
	,'stbs':434
	,'tta':0
	,'tti':0
	,'tts':0
	,'ttr':249
	,'by':'Ford, Chris (Contractor)'
	,'division':'Central Division'
	,'region':'Chicago'
	,'dac':'Chicago - West'
	,'device':'WC_NC_02'
	,'ip':'172.31.152.62'
	,'upstreams':'US_21228'
	,'reason':'HE Impairments'
	,'comment':"""STBs don't respond to interactive pings. 
CMTS codewords % errored high node WC03A.
Active Changelog tickets for node WC03A.
WC03A Plant Integrity: 2.25% DOCSIS Integrity: 19.35    504899781     PRIORITY_PLANT_FAULT     Freq: worst_channel, USTX      CONFIRMED_EVENT     7/17/16 6:22 PM - Job Ticket JB15073140.
"""
	,'root_cause':''
	,'corrective_action_taken':''
	,'si_ticket':''
	,'jb_ticket':''
	,'found_in_support_system':''
	,'alert_event_text':'None'
	,'alert_type':'none'
}
print payload

# r = requests.post('http://localhost:8000/hello')
r = requests.post('http://localhost:8000/ams-file-upload',headers=headers,data=payload)


print r.status_code
print r.text