import requests
import json
r = requests.get('https://tomahawk.sys.comcast.net/tomahawk_api.php?q=getAutocomplete',verify=False)
for each in json.loads(r.text):
	if 'ccdn-ss-15301B-07' in each['name']:
		print 'found == ', each
# r = requests.get('https://tomahawk.sys.comcast.net/tomahawk_api.php?q=null&search_string=ccdn-ss-15301B-07',verify=False)
# data =  json.loads(r.text.encode('utf-8'))
# print data

# r = requests.get('https://tomahawk.sys.comcast.net/tomahawk_api.php?q=getTemplate&t=hostSummary&id=13562&cache=true')

>>> import dateutil.tz
>>> t=dateutil.tz.tzoffset('EDT', 14400)
>>> from dateutil.parser import parse
>>> dt = parse('Tue Apr 26 2016 08:32:00 GMT-0400 (EDT)')
>>> dt
datetime.datetime(2016, 4, 26, 8, 32, tzinfo=tzlocal())
>>> t
tzoffset('EDT', 14400)
>>> dt.replace(tzinfo=t)
datetime.datetime(2016, 4, 26, 8, 32, tzinfo=tzoffset('EDT', 14400))