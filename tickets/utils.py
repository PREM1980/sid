import socket
import ldap

def getip():
	return [l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]



def check_user_auth(username,password):
	ldap.OPT_REFERRALS = 0
	ldap.LDAP_OPT_PROTOCOL_VERSION = ldap.VERSION3
	ldap_server="adapps.cable.comcast.com"
	username = "cable\\"+ username 
	connect = ldap.open(ldap_server)
	try:
		print 'ldap username == ', username
		print 'ldap password == ', password
		connect.simple_bind_s(username,password)
		return {'status':'success'}
	except ldap.INVALID_CREDENTIALS as e:
		connect.unbind_s()
		print "authentication error == ", e
		return {'status':'Authentication failed!! Enter correct username/password'}

def check_session_variable(request):
	if 'userid' in request.session:
		print 'utils session id set ==', request.session['userid']
		print 'utils session get_expiry date ==', request.session.get_expiry_date()
		print 'utils session get_expiry age ==', request.session.get_expiry_age()
		return request.session['userid']
	else:
		return None		