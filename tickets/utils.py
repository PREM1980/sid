import socket
import ldap
from django.conf import settings
from models import NinjaUsers
from dateutil import parser
from django.utils.timezone import localtime
from django.shortcuts import render, render_to_response, HttpResponse
import iso8601
import pytz
from dateutil import tz

# dt = iso8601.parse_date('2016-07-22 11:16:13+00:00')
# >>> tzlocal = tz.tzoffset('local',-240)
# >>> dt.astimezone(tzlocal)
# datetime.datetime(2016, 7, 22, 11, 12, 13, tzinfo=tzoffset('local', -240))
# >>> dt
# datetime.datetime(2016, 7, 22, 11, 16, 13, tzinfo=<FixedOffset '+00:00' datetime.timedelta(0)>)

def getip():
	try:
		return [l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
	except:
		return ''

def get_utc_ts(date):
	dt_time = iso8601.parse_date(date)
	return_date = dt_time.astimezone(pytz.utc)	
	return return_date

def convert_datetime_using_offset(dt,offset):
	print 'convert_datetime_using_offset old == ',type(dt)
	print 'convert_datetime_using_offset old == ',dt
	# dt = iso8601.parse_date(dt)
	tzlocal = tz.tzoffset('local',int(offset) * 60 )
	dt = dt.astimezone(tzlocal)
	print 'convert_datetime_using_offset new == ',dt
	return dt

def check_user_auth(username,password):
	ldap.OPT_REFERRALS = 0
	ldap.LDAP_OPT_PROTOCOL_VERSION = ldap.VERSION3
	ldap_server="adapps.cable.comcast.com"
	username = "cable\\"+ username 
	connect = ldap.open(ldap_server)

	# if settings.LOCAL_TEST_NINJA == True:
	# 	return {'status':'success'}
		
	try:
		print 'ldap username == ', username
		print 'ldap password == ', password
		connect.simple_bind_s(username,password)
		return {'status':'success'}
	except ldap.INVALID_CREDENTIALS as e:
		connect.unbind_s()
		print "authentication error == ", e
		# return {'status':'success'}
		return {'status':'Authentication failed!! Enter correct username/password'}

def check_session_variable(request):
	if 'userid' in request.session:
		print 'utils session id set ==', request.session['userid']		
		return request.session['userid']
	else:
		return None		

def hide_sid_create_section():
	hide = False

	if settings.LOCAL_TEST_NINJA == True:
		hide = False if settings.NINJA else True
	else:				
		if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
			hide = False
		else:
			hide = True
	return hide

def check_if_admin(user_id):
	return True if NinjaUsers.objects.filter(userid=user_id).filter(admin='Y').exists() else False

def page_redirects(request,userid, active_tab='', error_msg=''):		
	print 'active_tab == ', active_tab
	if settings.LOCAL_TEST_NINJA == True:
		if settings.NINJA == True:			
			return render(request,'dashboard/ninja_landing_page.html',{'error':'N','admin_user':check_if_admin(userid)})				
		else:
			print 'sid_landing_page'
			return render(request,'tickets/sid_landing_page.html',{'hide':hide_sid_create_section(),'admin_user':check_if_admin(userid),
						'active_tab':active_tab,'error_msg':error_msg})		
	else:				
		if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
			return render(request,'dashboard/ninja_landing_page.html',{'error':'N','admin_user':check_if_admin(userid)})												
		return render(request,'tickets/sid_landing_page.html',{'hide':hide_sid_create_section(),'admin_user':check_if_admin(userid),
						'active_tab':active_tab,'error_msg':error_msg})		

def page_redirects_login(request):
	if settings.LOCAL_TEST_NINJA == True:
		if settings.NINJA == True:			
			return render(request,'tickets/ninja_loginpage.html',{'error':'N'})
		else:
			return render(request,'tickets/sid_loginpage.html',{'error':'N'})
	
	if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
		return render(request,'tickets/ninja_loginpage.html',{'error':'N'})

	
	