from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from elasticsearch import Elasticsearch, ElasticsearchException
from elasticsearch_dsl import Search
from elasticsearch_dsl import Search, Q
from django.core import serializers
from models import Tickets, Division, Duration, Pg, ErrorCount, OutageCaused, SystemCaused,AddtNotes, NinjaUsers
from django.db import transaction
from uuid import UUID
from django.db import connection
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from xlsxwriter.workbook import Workbook

import logging
import socket
import uuid
import datetime
import json

logger = logging.getLogger('app_logger')

logger_feedback = logging.getLogger('feedback_logger')

import queries
import utils
from pytz import timezone

class LoginView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(LoginView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		return render(request,'tickets/mainpage.html',{'error':'N'})

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'tickets/mainpage.html',{'error':'N'})
		else:
			return render(request,'tickets/loginpage.html',{'error':'Y','msg':result['status']})

class NinjaUsersData(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(NinjaUsersData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		try:
			results = serializers.serialize('json', NinjaUsers.objects.all())
		except Exception as e:
			print 'NinjaUsersDataException == ', e 		
		return JsonResponse({'status': 'success', 'results':results})


class PostTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PostTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		alldata = {}
		ip = utils.getip()

		alldata['date'] = request.POST.get('date')
		alldata['division'] = request.POST.get('division')
		alldata['pg'] = request.POST.getlist('pg[]')
		alldata['error_count'] = request.POST.get('error_count')
		alldata['ticket_num'] = request.POST.get('ticket_num')
		alldata['outage_caused'] = request.POST.get('outage_caused')
		alldata['system_caused'] = request.POST.get('system_caused')
		alldata['addt_notes'] = request.POST.get('addt_notes')
		alldata['ticket_type'] = request.POST.get('ticket_type')
		alldata['duration'] = request.POST.get('duration')
		alldata['ticket_num']= request.POST.get('ticket_num')
		alldata['ticket_link']= request.POST.get('ticket_link')
		alldata['userid'] = request.POST.get('userid')

		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:
			print 'api_key ==', api_key
			if api_key is not None:
				error  = validate_insert_input(alldata)
				user_id = alldata['userid']
				if error is not None:
					return JsonResponse({'status': error})
						
			logger.debug("ip = {0} && post data  == {1}".format(ip,alldata))
			print 'insert validated data == ', alldata
			created_dt = datetime.datetime.strptime(
				str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
						
			t = Ticket(created_dt=created_dt
				,division=alldata.get('division')
				,pg=alldata.get('pg')
				,error_count=alldata.get('error_count')
				,ticket_num=alldata.get('ticket_num')
				,outage_caused=alldata.get('outage_caused')
				,system_caused=alldata.get('system_caused')
				,addt_notes=alldata.get('addt_notes')
				,ticket_type=alldata.get('ticket_type')
				,duration=alldata.get('duration')
				,timezone='tz'
				,ticket_link=alldata.get('ticket_link')
				)
			
			logger.debug("ip = {0} &&  insert document == {1}".format(ip,t))
			
			try:
				with transaction.atomic():
					div,created = Division.objects.get_or_create(division_name=t.division)
					dur,created = Duration.objects.get_or_create(duration=t.duration)
					err,created = ErrorCount.objects.get_or_create(error=t.error_count)
					out,created = OutageCaused.objects.get_or_create(outage_caused=t.outage_caused)
					sys,created = SystemCaused.objects.get_or_create(system_caused=t.system_caused)
					ticket_info = {
						'row_create_ts': created_dt,
						'ticket_num': t.ticket_num,
						'ticket_type': t.ticket_type,
						'division': div.ID,
						'duration': dur.ID,
						'error_count': err.ID,
						'outage_caused': out.ID,
						'system_caused': sys.ID,
						'create_user_id': user_id,
						'update_user_id': user_id,
						'timezone': created_dt,
						'ticket_link': t.ticket_link
					}
					print 'ticket_info == ', ticket_info

					try:
						ticket = Tickets.objects.get(ticket_num=t.ticket_num)
					except Tickets.DoesNotExist:
						ticket = None

					if ticket is None:
						ticket = Tickets.objects.create(**ticket_info)
					else:
						return JsonResponse({'status': 'Ticket already present'})
					
					for each in t.pg:
						p,created = Pg.objects.get_or_create(pg_cd=each)
						ticket.pgs.add(p)
					
					AddtNotes.objects.create(Id=ticket,notes=t.addt_notes)
					
			except Exception as e:
				print 'Exception == ', e 
				logger.debug("MySQLException == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})

def validate_insert_input(alldata):	
	print 'insert alldata == ', alldata
	valid_division = []
	valid_pgs = []	

	central = ['10201', '10202', '10203', '10204', '10401', '10402', '10404', '11701', '11702', '11703', '11704', '11801', '11802', '11803', '12601', '12602', '12603', '12701', '12702', '12703', '12704', '13401', '13402', '13701', '13702', '13703', '13704', '13705', '13901', '13902', '14001', '14002', '14003', '14401', '14402', '14403', '14404', '14405', '14406', '14701', '14702', '14703', '14704', '14705', '14706', '14801', '14802', '14803', '14804', '14805', '14806', '18101', '21301', '21302', '21303', '21304', '21305', '21306', '23001', '23002', '23101', '23102', '23103', '23104', '23301', '23501', '23601', '23701', '23801']
	west 	= ['10101', '10102', '12301', '12303', '13001', '13801', '14502', '14503', '16801', '16802', '16803', '17101', '17102', '17201', '17301', '17302', '17401', '17402', '17403', '17404', '17405', '17406', '17407', '17501', '17502', '17503', '17504', '17505', '17801', '17802', '17803', '17804', '17805', '17806', '17807', '17901', '18201', '21601', '21702', '21704', '24001', '24601', '24602']
	northeast = ['10501', '10601', '10701', '10702', '10801', '10901', '11001', '11101', '11102', '11201', '11202', '11203', '11301', '11401', '11402', '13201', '13301', '13501', '13502', '13601', '14901', '15001', '15101', '15102', '15301', '15401', '15501', '15601', '15801', '15901', '16001', '16101', '16201', '16401', '16501', '16601', '16701', '16702', '16703', '16704', '16901', '16902', '17001', '18001', '18501', '18701', '18702', '18703', '18801', '18901', '19001', '19501', '19601', '19701', '19901', '20101', '20201', '20701', '22001', '22002', '22301', '22302', '23201']

	national = central + west + northeast

	valid_division = ['National','Central','Northeast','Western']
	valid_division_lc = ['national','central','northeast','western']
	
	valid_durations = ['1 - 15 minutes'
					,'15 - 30 minutes'
					,'30 - 60 minutes'
					,'1 - 3 hours'
					,'Greater than 3 hours']

	valid_error_count = ['1,000 - 5,000'
					,'5,000 - 10,000'
					,'10,000 - 20,000'
					,'20,000 - 50,000'
					,'Greater than 50,000']

	valid_outage_caused = ['Scheduled Maintenance'
							,'Scheduled Maintenance resulting in Outage'
							,'NSA Scheduled Maintenance resulting in Outage'
							,'Comcast System Unplanned Outage'
							,'Non-Comcast System Outage']

	valid_system_caused = ['Capacity'
							,'Backoffice'
							,'Cisco Pump'
							,'Arris Pump'
							,'Network'
							,'UDB'
							,'Content'
							,'Aloha Network'
							,'Billing System'
							,'Other']

	error = None

	#If a ' ' or '   ' is passed, you need to strip the spaces. Most of the fields does not take spaces in SID...
	for key,value in alldata.items():
		if alldata[key] is not None and type(alldata[key]) is not list:
			if alldata[key].strip() == '':
				alldata[key] = '' 

	if alldata.get('date') in [None,'',' '] \
		or alldata.get('division') in [None,'',' '] \
		or len(alldata.get('pg')) ==  0 \
		or alldata.get('ticket_type') in [None,'',' '] \
		or alldata.get('ticket_num') in [None,'',' '] \
		or alldata.get('userid') in [None,'',' ']:
		error = """Please pass the mandatory parameters - date, ticket_num, division, list of peer groups, ticket type and  user id. """

	if  alldata.get('division').encode('ascii').lower() not in valid_division_lc:
		error = 'Division should be one of the following option :- ' + ','.join(valid_division)

	#If the API's send division names wrongly, it needs to be fixed.
	if  alldata.get('division').encode('ascii').lower() in valid_division_lc:
		ix = valid_division_lc.index(alldata.get('division').lower())
		alldata['division'] = valid_division[ix]

	#Check if the correct peer groups are sent for a particular division.
	if alldata.get('division') == valid_division[0]:
		for each in alldata.get['pg']:
			if each not in national:
				error = 'Not a valid peergroup for the given National division. Valid peergroups are:- ' + ' '.join(national)

	if alldata.get('division') == valid_division[1]:
		for each in alldata.get('pg'):
			if each not in central:
				error = 'Not a valid peergroup for the given central division. Valid peergroups are:- ' + ' '.join(central)
	
	if alldata.get('division') == valid_division[2]:
		for each in alldata.get('pg'):
			if each not in northeast:
				error = 'Not a valid peergroup for the given NorthEast division. Valid peergroups are:- ' + ' '.join(northeast)				

	if alldata.get('division') == valid_division[3]:
		for each in alldata.get('pg'):
			if each not in west:
				error = 'Not a valid peergroup for the given West division. Valid peergroups are:- ' + ' '.join(west)				

	if alldata.get('duration') not in [None,'']:
		if  alldata.get('duration') not in valid_durations:
			error = 'Duration should be one of the following option :- ' + ','.join(valid_durations)
	else:
		alldata['duration'] = ' '

	if alldata.get('error_count') not in [None,'']:
		if alldata.get('error_count') not in valid_error_count:
			error = 'Error count should be one of the following option :- ' + ','.join(valid_error_count)	
	else:
		alldata['error_count'] = ' '

	if alldata.get('outage_caused') not in [None,'']:
		if alldata.get('outage_caused') not in valid_outage_caused:
			error = 'Outage caused should be one of the following option :- ' + ','.join(valid_outage_caused)	
	else:
		alldata['outage_caused'] = ' '

	if alldata.get('system_caused') not in [None,'']:
		if alldata.get('system_caused') not in valid_system_caused:
			error = 'System caused should be one of the following option :- ' + ','.join(valid_system_caused)	
	else:
		alldata['system_caused'] = ' '

	#strip seconds from API timestamp to match the GUI timestamp
	alldata['date'] = alldata['date'][:-3]

	ticket_num, ticket_link = convert_link_to_ticket_num(alldata.get('ticket_num'))
	alldata['ticket_num'] = ticket_num
	alldata['ticket_link'] = ticket_link	

	print 'insert validate error == ', error

	return error
	
class GetTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(GetTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		
		user_id = utils.check_session_variable(request)

		print 'get_ticket_data userid == ', user_id
		ip = utils.getip()
		alldata = request.POST
		print 'GET alldata == ', alldata
		api_key = None
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if api_key is not None:
			if api_key != settings.API_KEY:
				return JsonResponse({'status': 'Invalid Key..Contact support!!'})

		logger.debug("user_id = {0} ".format(user_id))
		
		if user_id is not None or api_key == settings.API_KEY:
			output = get_ticket_data(alldata,api_key,ip,user_id)

			#print 'output == ', output
			logger.debug("ip = {0} &&  output == {1}".format(ip,output))
			
			return JsonResponse({'results': output,'status':'success'})
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

def get_ticket_data(alldata,api_key,ip,user_id):
	
	initial = alldata.get('initial')
	doc = {
		'start_date_s': alldata.get('start_date_s'),
		'start_date_e': alldata.get('start_date_e'),
		'division': alldata.get('division'),
		'duration': alldata.get('duration'),
		'pg': alldata.getlist('pg[]'),
		'error_count': alldata.get('error_count'),
		'ticket_num': alldata.get('ticket_num'),
		'outage_caused': alldata.get('outage_caused'),
		'system_caused': alldata.get('system_caused'),
		'ticket_type': alldata.get('ticket_type'),
	}
	
	if api_key is not None:
		if doc['start_date_e'] is None and doc['start_date_s'] is not None:
			return JsonResponse({'status': 'Start/End date should be specified-1'})
		if doc['start_date_s'] is None and doc['start_date_e'] is not None:
			return JsonResponse({'status': 'Start/End date should be specified-2'})
		if doc['division'] is None:
			doc['division'] = 'All'
		if doc['duration'] is None:
			doc['duration'] = 'All'
		if doc['pg'] is None:
			doc['pg'] = []
		if doc['error_count'] is None:
			doc['error_count'] = 'All'
		if doc['outage_caused'] is None:
			doc['outage_caused'] = 'All'
		if doc['system_caused'] is None:
			doc['system_caused'] = 'All'
		if doc['ticket_num'] is None:
			doc['ticket_num'] = ''
		
	
	logger.debug("ip = {0} &&  document == {1} ".format(ip,doc))

	try:
		if initial == 'Y':
			cursor = connection.cursor()
			cursor.execute(queries.all_query['generic'])
			results = cursor.fetchall()
		else:
			cursor = connection.cursor()

			start_date_qry_set = end_date_qry_set = duration_qry_set = error_count_qry_set = ticket_num_qry_set = division_qry_set = pg_qry_set = outage_qry_set = system_qry_set = False
			start_date_qry = end_date_qry = duration_qry = error_count_qry = ticket_num_qry = division_qry = pg_qry = outage_qry = system_qry = ''
			
			if doc['start_date_s'] == '' and doc['start_date_e'] == '':
				pass
			elif doc['start_date_s'] != '' and doc['start_date_e'] == '':
				doc['start_date_e'] = doc['start_date_s']
				start_date_qry_set = True
				start_date_s = datetime.datetime.strptime(doc['start_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
				start_date_e = datetime.datetime.strptime(doc['start_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
				start_date_qry = " tb1.row_create_ts between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)
			elif doc['start_date_s'] == '' and doc['start_date_e'] != '':
				doc['start_date_s'] = doc['start_date_e']
				start_date_qry_set = True
				start_date_s = datetime.datetime.strptime(doc['start_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
				start_date_e = datetime.datetime.strptime(doc['start_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
				start_date_qry = " tb1.row_create_ts between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)
			else:
				start_date_qry_set = True
				start_date_s = datetime.datetime.strptime(doc['start_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
				start_date_e = datetime.datetime.strptime(doc['start_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
				start_date_qry = " tb1.row_create_ts between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)


			# if doc['end_date_s'] == '' and doc['end_date_e'] == '':
			# 	pass
			# else:
			# 	end_date_qry_set = True
			# 	end_date_s = datetime.datetime.strptime(doc['end_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
			# 	end_date_e = datetime.datetime.strptime(doc['end_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
			# 	end_date_qry = " tb1.row_end_ts between '{end_date_s}' and '{end_date_e}' ".format(end_date_s=end_date_s,end_date_e=end_date_e)

			if doc['ticket_num'] == '':
				ticket_num_qry = ""
			else:
				ticket_num_qry_set = True
				ticket_num_qry = " tb1.ticket_num = '{ticket_num}' ".format(ticket_num=doc['ticket_num'])

			if doc['error_count'] in ['Error Count','All']:
				error_count_qry = ""
			else:
				error_count_qry_set = True
				error_count_qry = " tb4.error = '{error}' ".format(error=doc['error_count'])


			if doc['duration'] in ['Duration (in mins)','All']:
				duration_qry = ""
			else:
				duration_qry_set = True
				duration_qry = " tb3.duration = '{duration}' ".format(duration=doc['duration'])


			if doc['division'] in ['Division','All']:
				division_qry = ""
			else:
				division_qry_set = True
				division_qry = " tb2.division_name = '{division}' ".format(division=doc['division'])

			if len(doc['pg']) == 0:
				pg_qry = ""
			else:
				pg_qry_set = True
				pg_cds = ['"' + each + '"' for each in doc['pg']]
				pg_cds = ' , '.join(pg_cds)
				pg_cds = pg_cds + ' ,"{0}"'.format('ALL')
				pg_qry = " tb8.pg_cd in ({pg_cds}) ".format(pg_cds=pg_cds)

			if doc['outage_caused'] in ['Outage Caused','All']:
				outage_qry = ''
			else:
				outage_qry_set = True
				outage_qry = " tb5.outage_caused = '{outage_caused}' ".format(outage_caused=doc['outage_caused'])

			
			if doc['system_caused'] in ['System Caused','All']:
				system_qry = ''
			else:
				system_qry_set = True
				system_qry = " tb6.system_caused = '{system_caused}' ".format(system_caused=doc['system_caused'])

			order_qry = ' order by created_dt '

			#Special condition when certain peer groups are selected.
			if doc['division'] == 'All' and pg_qry_set:
				pg_qry1 = " tb1.pg_cd in ({pg_cds}) ".format(pg_cds=pg_cds)
				qry = """
						select distinct tb2.tickets_id
						from sid.pg tb1 
						inner join
						sid.tickets_pgs tb2
						on tb1.pg_id = tb2.pg_id
						where """
				qry = qry + pg_qry1 
				cursor.execute(qry)
				results = cursor.fetchall()
				elig_tkts = []
				
				for each in results:
					elig_tkts.append(each[0])

				print 'elig_tkts == ', elig_tkts

				if len(elig_tkts) == 0:
					ticket_num_qry = " tb1.ticket_num = '' "
				else:
					pg_qry_set = False
					ticket_num_qry_set = True
					tkts = ['"' + each + '"' for each in elig_tkts]
					tkts = ' , '.join(tkts)
					ticket_num_qry = " tb1.ticket_num in ({tkts}) ".format(tkts=tkts)

				p_qry = queries.all_query['pg_conditions']
				
				kwargs = {'qry':p_qry
				,'start_date_qry_set':start_date_qry_set
				,'end_date_qry_set':end_date_qry_set
				,'division_qry_set':division_qry_set
				,'pg_qry_set':pg_qry_set
				,'outage_qry_set':outage_qry_set
				,'system_qry_set':system_qry_set
				,'error_count_qry_set':error_count_qry_set
				,'duration_qry_set':duration_qry_set
				,'ticket_num_qry_set':ticket_num_qry_set
				,'start_date_qry':start_date_qry
				,'end_date_qry':end_date_qry
				,'division_qry':division_qry
				,'pg_qry':pg_qry
				,'outage_qry':outage_qry
				,'system_qry':system_qry
				,'error_count_qry':error_count_qry
				,'duration_qry':duration_qry
				,'ticket_num_qry':ticket_num_qry						
				}

				p_qry = set_query_params(**kwargs)
				p_qry = p_qry + ' ORDER BY tb1.row_create_ts desc, tb1.ticket_num desc LIMIT 100'
				print 'over**'
				print '***pg_qry*** == ', p_qry

				logger.debug("ip = {0} &&  multiple tkt_qry == {1}".format(ip,p_qry))
				cursor.execute(p_qry)
				results = cursor.fetchall()

			else:
				qry = queries.all_query['conditions']

				kwargs = {'qry':qry
				,'start_date_qry_set':start_date_qry_set
				,'end_date_qry_set':end_date_qry_set
				,'division_qry_set':division_qry_set
				,'pg_qry_set':pg_qry_set
				,'outage_qry_set':outage_qry_set
				,'system_qry_set':system_qry_set
				,'error_count_qry_set':error_count_qry_set
				,'duration_qry_set':duration_qry_set
				,'ticket_num_qry_set':ticket_num_qry_set
				,'start_date_qry':start_date_qry
				,'end_date_qry':end_date_qry
				,'division_qry':division_qry
				,'pg_qry':pg_qry
				,'outage_qry':outage_qry
				,'system_qry':system_qry
				,'error_count_qry':error_count_qry
				,'duration_qry':duration_qry
				,'ticket_num_qry':ticket_num_qry						
				}
				qry = set_query_params(**kwargs)
				
				qry = qry + ' ORDER BY tb1.row_create_ts desc, tb1.ticket_num desc'

				logger.debug("ip = {0} &&  query == {1}".format(ip,qry))
				cursor.execute(qry)
				results = cursor.fetchall()
		
		logger.debug("ip = {0} &&  results-len == {1}".format(ip,len(results)))
		output = enum_results(user_id,results)
		
	except Exception as e:
		print 'Select Exception == ', e
		logger.debug("MySQLException == {0}".format(e))
		return JsonResponse({'status': 'failure'})

	return output


def set_query_params(**kwargs):

	prev_qry_set = False
	qry = kwargs['qry']

	if kwargs['start_date_qry_set'] \
		or kwargs['end_date_qry_set'] \
		or kwargs['division_qry_set'] \
		or kwargs['pg_qry_set']	\
		or kwargs['outage_qry_set']	\
		or kwargs['system_qry_set']	\
		or kwargs['ticket_num_qry_set'] \
		or kwargs['duration_qry_set'] \
		or kwargs['error_count_qry_set']:
		qry = kwargs['qry']  + ' and '

	if kwargs['start_date_qry_set']:
		qry = qry + kwargs['start_date_qry']
		prev_qry_set = True 

	# if end_date_qry_set:
	# 	if prev_qry_set:
	# 		qry = qry + ' and ' + end_date_qry 
	# 		prev_qry_set = True
	# 	else:
	# 		qry = qry + end_date_qry
	# 		prev_qry_set = True

	print 'prem qry = ', qry	
	if kwargs['ticket_num_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['ticket_num_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['ticket_num_qry']
			prev_qry_set = True					

	if kwargs['duration_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['duration_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['duration_qry']
			prev_qry_set = True

	if kwargs['error_count_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['error_count_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['error_count_qry']
			prev_qry_set = True

	if kwargs['division_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['division_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['division_qry']
			prev_qry_set = True
			
	if kwargs['pg_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['pg_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['pg_qry']
			prev_qry_set = True

	if kwargs['outage_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['outage_qry']
			prev_qry_set = True
		else:
			qry = qry + kwargs['outage_qry']  
			prev_qry_set = True

	if kwargs['system_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['system_qry'] 
		else:
			qry = qry + kwargs['system_qry']
	#print 'set_quert_params system == ', qry
	print 'set_quert_params final query== ', qry
	return qry


def enum_results(user_id,results):
	prev_ticket_num = ''
	pg_cd = []
	data = {}
	output = []

	for counter, each in enumerate(results):
		curr_ticket_num = each[0]
		if counter == 0:
			prev_ticket_num = curr_ticket_num				
						
		if prev_ticket_num == curr_ticket_num:			
			data['ticket_num'] = each[0]
			data['created_dt'] = each[1]
			if each[4].year == 9999:
				data['row_end_ts'] = ""
			else:
				data['row_end_ts'] = each[4]
			data['ticket_type'] = each[2]
			data['division'] = each[5]
			pg_cd.append(each[10])
			data['duration'] = each[6]
			data['error_count'] = each[7]
			data['outage_caused'] = each[8]
			data['system_caused'] = each[9]
			data['crt_user_id'] = each[12]
			data['upd_user_id'] = each[13]
			data['login_id'] = user_id
			data['ticket_link'] = each[14]
			if each[11] is None:
				data['addt_notes'] = ""
			else:
				data['addt_notes'] = each[11]

		else:
			if 'ALL' in pg_cd:
				pg_cd = ['ALL']
			data['pg'] = pg_cd

			output.append(data)
			data = {}
			pg_cd = []

			data['ticket_num'] = each[0]
			data['created_dt'] = each[1]
			#data['row_end_ts'] = each[4]
			if each[4].year == 9999:
				data['row_end_ts'] = ""
			else:				
				data['row_end_ts'] = each[4]
			data['ticket_type'] = each[2]
			data['division'] = each[5]
			pg_cd.append(each[10])
			data['duration'] = each[6]
			data['error_count'] = each[7]
			data['outage_caused'] = each[8]
			data['system_caused'] = each[9]
			data['crt_user_id'] = each[12]
			data['upd_user_id'] = each[13]
			data['login_id'] = user_id
			data['ticket_link'] = each[14]

			if each[11] is None:
				data['addt_notes'] = ""
			else:
				data['addt_notes'] = each[11]

			#Limit the number of rows displayed to 100.
			if len(output) > 100:
				break

		prev_ticket_num = curr_ticket_num

	if len(results) > 0:	
		data['pg'] = pg_cd
		output.append(data)

		data = {}
		pg_cd = []			

	return output



class PDFDownload(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PDFDownload, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		ip = utils.getip()
		alldata = request.POST
		api_key = None
		api_key = request.META.get('HTTP_AUTHORIZATION')
		print 'download request.POST alldata== ', alldata
		print 'download ip== ', ip

		if api_key is not None:
			if api_key != settings.API_KEY:
				return JsonResponse({'status': 'Invalid Key..Contact support!!'})

		logger.debug("user_id = {0} ".format(user_id))
		if user_id is not None or api_key == settings.API_KEY:
			output = get_ticket_data(alldata,api_key,ip,user_id)
			logger.debug("ip = {0} &&  output == {1}".format(ip,output))
			dt = '{:%a_%b_%Y_%H_%M_%S}'.format(datetime.datetime.now())
			filename = 'Service_Impact_Database_Report_' + dt + '.pdf'
			response = HttpResponse(content_type='application/pdf')
			response['Content-Disposition'] = 'attachment; filename=' + filename

			# Create the PDF object, using the response object as its "file."
			p = canvas.Canvas(response,pagesize=letter)

			# Draw things on the PDF. Here's where the PDF generation happens.
			# See the ReportLab documentation for the full list of functionality.
			
			output = get_ticket_data(alldata,api_key,ip,user_id)
			
			#output = []

			width, height = letter

			p.setLineWidth(.3)
			p.setFont('Helvetica',12)
			
			print 'width == ', width
			print 'height == ', height
			dt = '{:%a/%b/%Y %H:%M:%S}'.format(datetime.datetime.now())
			p.setFont('Helvetica-Bold',16)
			p.drawString(200, 420, 'Event Coorelation records ')
			p.drawString(160, 400, 'Report Generated at : ' + dt)
			p.save()

			(incr, x, y, x1) = initpages(height)
				

			for each in output:
				# print 'value of height = {0} , value of x = {1} , value of y = {2}'.format(height,x,y)
				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'User Id:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['crt_user_id'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Create Date:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, '{:%a %b %Y %H:%M:%S}'.format(each['created_dt']))
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'End Date:')
				p.setFont('Helvetica',12)
				if each['row_end_ts'] != "":
					#sheet.write(row,2,'{:%a %b %Y %H:%M:%S}'.format(each['row_end_ts']))
					p.drawString(x1, y, '{:%a %b %Y %H:%M:%S}'.format(each['row_end_ts']))
				y = y - incr
				y = page_break_called(p,y,height)
				
				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Ticket #:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['ticket_num'])
				y = y - incr
				y = page_break_called(p,y,height)
				
				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Division:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['division'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'PeerGroup:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, ','.join(each['pg']))
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Duration:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['duration'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Error Count:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['error_count'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Outage Caused:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['outage_caused'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'System Caused:')
				p.setFont('Helvetica',12)
				p.drawString(x1, y, each['system_caused'])
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'Addt Notes:')
				p.setFont('Helvetica',12)
				n = 75
				split_lines = [each['addt_notes'][i:i+n] for i in range(0, len(each['addt_notes']), n)]

				for line in split_lines:
					p.drawString(x1, y, line)
					y = y - incr
					y = page_break_called(p,y,height)
				
				if len(split_lines) == 0:
					p.drawString(x1, y, each['addt_notes'])
					y = y - incr
					y = page_break_called(p,y,height)

			# Close the PDF object cleanly, and we're done.
				p.drawString(x, y, 120 * '-')
				y = y - incr
				y = page_break_called(p,y,height)


			p.save()
			print 'PDF response done'
			return response
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

def initpages(height):
	incr = 15
	x = 20
	x1 = 130
	y = height - 30
	return incr, x, y, x1

def page_break_called(p,y,height):

	if y < 40:
		print 'page break called height == ', str(height) + ' **  ' + str(y)
		p.showPage()
		(incr, x, y, x1) = initpages(height)
		width, height = letter
		#p.append(PageBreak())	
		#return height
	return y


class ExcelDownload(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ExcelDownload, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		ip = utils.getip()
		alldata = request.POST
		api_key = None
		api_key = request.META.get('HTTP_AUTHORIZATION')
		print 'download request.POST alldata== ', alldata
		print 'download ip== ', ip

		if api_key is not None:
			if api_key != settings.API_KEY:
				return JsonResponse({'status': 'Invalid Key..Contact support!!'})

		logger.debug("user_id = {0} ".format(user_id))
		if user_id is not None or api_key == settings.API_KEY:
			output = get_ticket_data(alldata,api_key,ip,user_id)
			logger.debug("ip = {0} &&  output == {1}".format(ip,output))

			import StringIO
			# create a workbook in memory
			output = StringIO.StringIO()
			book = Workbook(output)

			sheet = book.add_worksheet('tickets')
			boldformat = book.add_format({'bold':True})

			sheet.set_column(0,15,25)

			curr_time = datetime.datetime.now(timezone('UTC'))
			now_est = curr_time.astimezone(timezone('US/Eastern'))
			fmt = "%Y-%m-%d %H:%M:%S %Z%z"

			sheet.write(0, 0, 'Event Coorelation records  -- Report Generated at : ' + now_est.strftime(fmt), boldformat)

			sheet.write(3, 0, 'User Id',boldformat)
			sheet.write(3, 1, 'Create Date',boldformat)
			sheet.write(3, 2, 'End Date',boldformat)
			sheet.write(3, 3, 'Ticket#',boldformat)
			sheet.write(3, 4, 'Division',boldformat)
			sheet.write(3, 5, 'PeerGroup',boldformat)
			sheet.write(3, 6, 'Duration',boldformat)
			sheet.write(3, 7, 'Error Count',boldformat)
			sheet.write(3, 8, 'Outage Caused',boldformat)
			sheet.write(3, 9, 'System Caused',boldformat)
			sheet.write(3, 10, 'Addt Notes',boldformat)
			row = 4
			data = get_ticket_data(alldata,api_key,ip,user_id)
			for each in data:
				sheet.write(row,0,each['crt_user_id'])
				sheet.write(row,1,'{:%d %b %Y %H:%M:%S}'.format(each['created_dt']))
				if each['row_end_ts'] != "":
					sheet.write(row,2,'{:%d %b %Y %H:%M:%S}'.format(each['row_end_ts']))
				sheet.write(row,3,each['ticket_num'])
				sheet.write(row,4,each['division'])
				sheet.write(row,5,','.join(each['pg']))
				sheet.write(row,6,each['duration'])
				sheet.write(row,7,each['error_count'])
				sheet.write(row,8,each['outage_caused'])
				sheet.write(row,9,each['system_caused'])
				sheet.write(row,10,each['addt_notes'])
				row += 1

			book.close()
			# construct response
			output.seek(0)
			response = HttpResponse(output.read(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			filename = 'Service_Impact_Database_Report_' + '{:%a_%b_%Y_%H_%M_%S}'.format(datetime.datetime.now())
			response['Content-Disposition'] = "attachment; filename=" + filename + '.xlsx'
			return response
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

class UpdateTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(UpdateTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		ip = utils.getip()
		# alldata['date'] = request.POST.get('date')
		# alldata['division'] = request.POST.get('division')
		# alldata = request.POST
		print 'request.POST == ', request.POST
		alldata = {}
		alldata['created_dt'] = request.POST.get('created_dt')
		alldata['end_dt'] = request.POST.get('end_dt')
		alldata['division'] = request.POST.get('division')
		alldata['pg'] = request.POST.getlist('pg[]')
		alldata['error_count'] = request.POST.get('error_count')
		alldata['ticket_num'] = request.POST.get('ticket_num')
		alldata['outage_caused'] = request.POST.get('outage_caused')
		alldata['system_caused'] = request.POST.get('system_caused')
		alldata['addt_notes'] = request.POST.get('addt_notes')
		alldata['ticket_type'] = request.POST.get('ticket_type')
		alldata['duration'] = request.POST.get('duration')
		alldata['ticket_num']= request.POST.get('ticket_num')
		# alldata['ticket_link']= request.POST.get('ticket_link')
		alldata['userid'] = request.POST.get('userid')
		alldata['update_end_dt'] = request.POST.get('update_end_dt')
		
		logger.debug("ip = {0} &&  alldata == {1}".format(ip,alldata))
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:
			print 'update alldata == ', alldata
			
			# Don't move this IF stmt below
			if alldata.get('update_end_dt') == 'Y':
			   ticket_num, ticket_link = convert_link_to_ticket_num(alldata.get('ticket_num'))
			   ticket = Tickets.objects.get(ticket_num=ticket_num)
			   eastern = timezone('US/Eastern')
			   ticket.row_end_ts = datetime.datetime.now(eastern)
			   print 'row_end_ts == ', ticket.row_end_ts
			   ticket.row_end_ts = datetime.datetime.strftime(ticket.row_end_ts,'%Y-%m-%d %H:%M:00')
			   ticket.save()
			   return JsonResponse({'status': 'success'})

			if api_key is not None:
				error = validate_update_input(alldata)

				print 'update validated data == ', alldata
				if error is not None:
					return JsonResponse({'status': error})


			created_dt = None
			end_dt = None

			if alldata['created_dt'] is not None:
				if api_key is not None:
					#strip seconds from API timestamp to match the GUI timestamp
					alldata['created_dt'] = alldata['created_dt'][:-3]
				
				created_dt = datetime.datetime.strptime(
				str(alldata.get('created_dt')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')			

			if alldata['end_dt'] is not None:			
				if api_key is not None:
					#strip seconds from API timestamp to match the GUI timestamp
					alldata['end_dt'] = alldata['end_dt'][:-3]
				
				end_dt = datetime.datetime.strptime(
					str(alldata.get('end_dt')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
				
				print 'end_dt ===', end_dt


			t = Ticket(created_dt=created_dt
				,end_dt=end_dt
				,division=alldata.get('division')
				,pg=alldata.get('pg')
				,error_count=alldata.get('error_count')
				,ticket_num=alldata.get('ticket_num')
				,outage_caused=alldata.get('outage_caused')
				,system_caused=alldata.get('system_caused')
				,addt_notes=alldata.get('addt_notes')
				,ticket_type=alldata.get('ticket_type')
				,duration=alldata.get('duration'))
			
			print 'update doc  == ', t

			logger.debug("ip == {0} && Update document == {1}".format(ip,t))
			if t.division is None and len(t.pg) == 0:
				tkt = Tickets.objects.get(ticket_num=t.ticket_num)
				t.division = Division.objects.get(ID=tkt.division).division_name
				collect_pgs = []
				for each in tkt.pgs.all():
					collect_pgs.append(each.pg_cd)
				t.pg = collect_pgs

			try:
				with transaction.atomic():
					
					div,created = Division.objects.get_or_create(division_name=t.division)
					dur,created = Duration.objects.get_or_create(duration=t.duration)
					err,created = ErrorCount.objects.get_or_create(error=t.error_count)
					out,created = OutageCaused.objects.get_or_create(outage_caused=t.outage_caused)
					sys,created = SystemCaused.objects.get_or_create(system_caused=t.system_caused)
					
					try:
						ticket = Tickets.objects.get(ticket_num=t.ticket_num)
						print 'Update get ticket object == ', ticket
						if div.ID is not None:
							ticket.division = div.ID
						if dur.ID is not None:
							ticket.duration = dur.ID
						if err.ID is not None:
							ticket.error_count = err.ID
						if out.ID is not None:
							ticket.outage_caused = out.ID
						if sys.ID is not None:
							ticket.system_caused = sys.ID

						ticket.update_user_id = user_id
						if t.created_dt is not None:
							ticket.row_create_ts = t.created_dt
						
						if t.end_dt is not None:
							ticket.row_end_ts = t.end_dt
						
						ticket.save()
						AddtNotes.objects.get(Id=ticket).delete()
						AddtNotes.objects.create(Id=ticket,notes=t.addt_notes)
					except Tickets.DoesNotExist:
						ticket = None

					for each_pg in ticket.pgs.all():
						ticket.pgs.remove(each_pg)

					for each_pg in t.pg:
						p,created = Pg.objects.get_or_create(pg_cd=each_pg)
						ticket.pgs.add(p)					
			except Exception as e:
				print 'Exception == ', e 
				logger.debug("MySQLException == {0}".format(e))
				return JsonResponse({'status': 'failure'})

			return JsonResponse({'status': 'success'})
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

def validate_update_input(alldata):	
	print 'alldata == ', alldata
	valid_division = []
	valid_pgs = []	

	central = ['10201', '10202', '10203', '10204', '10401', '10402', '10404', '11701', '11702', '11703', '11704', '11801', '11802', '11803', '12601', '12602', '12603', '12701', '12702', '12703', '12704', '13401', '13402', '13701', '13702', '13703', '13704', '13705', '13901', '13902', '14001', '14002', '14003', '14401', '14402', '14403', '14404', '14405', '14406', '14701', '14702', '14703', '14704', '14705', '14706', '14801', '14802', '14803', '14804', '14805', '14806', '18101', '21301', '21302', '21303', '21304', '21305', '21306', '23001', '23002', '23101', '23102', '23103', '23104', '23301', '23501', '23601', '23701', '23801']
	west 	= ['10101', '10102', '12301', '12303', '13001', '13801', '14502', '14503', '16801', '16802', '16803', '17101', '17102', '17201', '17301', '17302', '17401', '17402', '17403', '17404', '17405', '17406', '17407', '17501', '17502', '17503', '17504', '17505', '17801', '17802', '17803', '17804', '17805', '17806', '17807', '17901', '18201', '21601', '21702', '21704', '24001', '24601', '24602']
	northeast = ['10501', '10601', '10701', '10702', '10801', '10901', '11001', '11101', '11102', '11201', '11202', '11203', '11301', '11401', '11402', '13201', '13301', '13501', '13502', '13601', '14901', '15001', '15101', '15102', '15301', '15401', '15501', '15601', '15801', '15901', '16001', '16101', '16201', '16401', '16501', '16601', '16701', '16702', '16703', '16704', '16901', '16902', '17001', '18001', '18501', '18701', '18702', '18703', '18801', '18901', '19001', '19501', '19601', '19701', '19901', '20101', '20201', '20701', '22001', '22002', '22301', '22302', '23201']

	national = central + west + northeast + ['All','ALL']

	valid_division = ['National','Central','Northeast','Western']
	valid_division_lc = ['national','central','northeast','western']
	
	valid_durations = ['1 - 15 minutes'
					,'15 - 30 minutes'
					,'30 - 60 minutes'
					,'1 - 3 hours'
					,'Greater than 3 hours']

	valid_error_count = ['1,000 - 5,000'
					,'5,000 - 10,000'
					,'10,000 - 20,000'
					,'20,000 - 50,000'
					,'Greater than 50,000']

	valid_outage_caused = ['Scheduled Maintenance'
							,'Scheduled Maintenance resulting in Outage'
							,'NSA Scheduled Maintenance resulting in Outage'
							,'Comcast System Unplanned Outage'
							,'Non-Comcast System Outage']

	valid_system_caused = ['Capacity'
							,'Backoffice'
							,'Cisco Pump'
							,'Arris Pump'
							,'Network'
							,'UDB'
							,'Content'
							,'Aloha Network'
							,'Billing System'
							,'Other']

	error = None

	#If a ' ' or '   ' is passed, you need to strip the spaces. Most of the fields does not take spaces in SID...
	for key,value in alldata.items():
		if alldata[key] is not None and type(alldata[key]) is not list:
			if alldata[key].strip() == '':
				alldata[key] = '' 

	if alldata.get('ticket_num') is [None,''] \
		or alldata.get('userid') is [None,'']:
		error = 'Please pass the mandatory parameters - "ticket number"  &  "user id" part your input'	

	if alldata.get('division') not in [None,''] and len(alldata.get('pg')) == 0:
		error = 'Please pass the list of peer groups with Division'	

	if alldata.get('division') in [None,''] and len(alldata.get('pg')) != 0:
		error = 'Please pass the list of peer groups with Division'	

	if alldata.get('division') not in [None,''] and len(alldata.get('pg')) != 0:
		if  alldata.get('division').encode('ascii').lower() not in valid_division_lc:
			error = 'Division should be one of the following option :- ' + ','.join(valid_division)

		#If the API's send division names wrongly, it needs to be fixed.
		if  alldata.get('division').encode('ascii').lower() in valid_division_lc:
			ix = valid_division_lc.index(alldata.get('division').lower())
			alldata['division'] = valid_division[ix]

		#Check if the correct peer groups are sent for a particular division.
		if alldata.get('division') == valid_division[0]:
			for each in alldata.get('pg'):
				if each not in national:
					error = 'Not a valid peergroup for the given National division. Valid peergroups are:- ' + ' '.join(national)

		if alldata.get('division') == valid_division[1]:
			for each in alldata.get('pg'):
				if each not in central:
					error = 'Not a valid peergroup for the given central division. Valid peergroups are:- ' + ' '.join(central)
		
		if alldata.get('division') == valid_division[2]:
			for each in alldata.get('pg'):
				if each not in northeast:
					error = 'Not a valid peergroup for the given NorthEast division. Valid peergroups are:- ' + ' '.join(northeast)				

		if alldata.get('division') == valid_division[3]:
			for each in alldata.get('pg'):
				if each not in west:
					error = 'Not a valid peergroup for the given West division. Valid peergroups are:- ' + ' '.join(west)						

	if alldata.get('duration') not in [None,'']:
		if alldata.get('duration') not in valid_durations:
			error = 'Duration should be one of the following option :- ' + ','.join(valid_durations)
	else:
		alldata['duration'] = ' '

	if alldata.get('error_count') not in [None,'']:
		if alldata.get('error_count') not in valid_error_count:
			error = 'Error count should be one of the following option :- ' + ','.join(valid_error_count)	
	else:
		alldata['error_count'] = ' '


	if alldata.get('outage_caused') not in [None,'']:
		if alldata.get('outage_caused') not in valid_outage_caused:
			error = 'Outage caused should be one of the following option :- ' + ','.join(valid_outage_caused)	
	else:
		alldata['outage_caused'] = ' '

	if alldata.get('system_caused') not in [None,'']:
		if alldata.get('system_caused') not in valid_system_caused:
			error = 'System caused should be one of the following option :- ' + ','.join(valid_system_caused)	
	else:
		alldata['system_caused'] = ' '


	print 'alldata.get("ticket_num")[0:4] == ', alldata.get('ticket_num')[0:4]
	ticket_num, ticket_link = convert_link_to_ticket_num(alldata.get('ticket_num'))
	alldata['ticket_num'] = ticket_num
	alldata['ticket_link'] = ticket_link

	if alldata['created_dt'] == '' or alldata['end_dt'] == '':
		error = 'Please check the created_dt and end_dt. They cannot contain spaces. Example format:- 2016/06/13 23:20:00 '

	return error
	
def convert_link_to_ticket_num(ticket_num):
	if ticket_num[0:4] == 'http':
		store_ticket_num = ticket_num
		ticket_num = ticket_num[::-1].split('/')[0][::-1]
		ticket_link = ticket_num
	else:
		ticket_link = ''
	return ticket_num, ticket_link

class ChartsView(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ChartsView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		print 'userid ==', userid
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})

		
		return render(request,'tickets/chartspage.html')

	def post(self, request):
		ip = utils.getip()
		logger_feedback.debug("Ip-address == {0} && Name == {1} && Email == {2} && Message == {3} && Rating == {4}".format(ip,request.POST['name'],request.POST['email'], request.POST['message'], request.POST['radio_list_value']))
		return JsonResponse({'status': 'success'})


class ChartsData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ChartsData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		print 'charts datauserid ==', userid
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		cursor = connection.cursor()
		cursor.execute("""select x.duration, count(*) from 
				(select tb2.duration
				from sid.tickets tb1
				inner join sid.duration tb2
				on tb2.duration_id = tb1.duration_id
				where tb1.valid_flag = 'Y') x
				group by x.duration""")
		results_duration= cursor.fetchall()		

		cursor.execute("""select x.error, count(*) from 
				(select tb2.error
				from sid.tickets tb1
				inner join sid.error_count tb2
				on tb2.error_count_id = tb1.error_count_id
				where tb1.valid_flag = 'Y') x
				group by x.error""")
		results_error_count = cursor.fetchall()		

		cursor.execute("""select x.system_caused, count(*) from 
				(select tb2.system_caused
				from sid.tickets tb1
				inner join sid.system_caused tb2
				on tb2.system_caused_id = tb1.system_caused_id
				where tb1.valid_flag = 'Y') x
				group by x.system_caused""")
		results_system_caused = cursor.fetchall()		

		cursor.execute("""select x.outage_caused, count(*) from 
				(select tb2.outage_caused
				from sid.tickets tb1
				inner join sid.outage_caused tb2
				on tb2.outage_caused_id = tb1.outage_caused_id
				where tb1.valid_flag = 'Y') x
				group by x.outage_caused""")
		results_outage_caused = cursor.fetchall()		

		cursor.execute("""select x.division_name, count(*) from 
				(select tb2.division_name
				from sid.tickets tb1
				inner join sid.division tb2
				on tb2.division_id = tb1.division_id
				where tb1.valid_flag = 'Y') x
				group by x.division_name""")
		results_division = cursor.fetchall()		


		cursor.execute("""select tb3.pg_cd,count(*)  from 
					sid.tickets_pgs tb1
					inner join 
					sid.tickets tb2
					on tb1.tickets_id = tb2.ticket_num
					inner join 
					sid.pg tb3
					on tb3.pg_id = tb1.pg_id
					and tb2.valid_flag = 'y'
					group by tb3.pg_cd
					""")
		results_pg = cursor.fetchall()		
		# """
		# SELECT  count(*) AS count, CONCAT(dt, ' - ', dt + INTERVAL 6 DAY) AS week from 
		# 	(select date(row_create_ts) as dt from sid.tickets where valid_flag = 'Y') x
		# 	GROUP BY WEEK(dt)
		# 	ORDER BY WEEK(dt)  
		# """

		cursor.execute('set sql_mode = ""')
		cursor.execute(
			"""
			select count(*) as count, concat(dt, ' - ', dt + INTERVAL 6 DAY) as week from
			(select date(row_create_ts) as dt from sid.tickets where valid_flag = 'Y') x
			group by week(dt)			
			"""
			)
		results_group_ticket_by_week = cursor.fetchall()		

		cursor.execute("""select crt_user_id, count(*)
							from sid.tickets
							where valid_flag = 'Y'
							group by crt_user_id""")
		results_group_users_get_count = cursor.fetchall()

		cursor.close()
		connection.close()
		print 'chartdata over'
		return JsonResponse({'status': 'success','results_duration':results_duration,'results_error_count':results_error_count,
			'results_system_caused':results_system_caused,'results_outage_caused':results_outage_caused,
			'results_division':results_division, 'results_pg': results_pg,
			'results_group_ticket_by_week': results_group_ticket_by_week,
			'results_group_users_get_count': results_group_users_get_count
			})


	def post(self, request):
		ip = utils.getip()
		logger_feedback.debug("Ip-address == {0} && Name == {1} && Email == {2} && Message == {3} && Rating == {4}".format(ip,request.POST['name'],request.POST['email'], request.POST['message'], request.POST['radio_list_value']))
		return JsonResponse({'status': 'success'})



class RecordFeedBack(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(RecordFeedBack, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		ip = utils.getip()
		alldata = request.POST
		logger.debug("ip = {0} &&  alldata == {1}".format(ip,alldata))
		api_key = request.META.get('HTTP_AUTHORIZATION')
		if user_id is not None or api_key == settings.API_KEY:
			pass
		return JsonResponse({'status': 'success'})


class Ticket(object):
	def __init__(self, created_dt = None, end_dt = None, division = None, pg = None, error_count = None, ticket_num = None, outage_caused = None, system_caused = None, addt_notes = None, ticket_type = None, duration = None, timezone = None, ticket_link = None):
		self.created_dt = created_dt
		self.end_dt = end_dt
		self.division = division 
		self.pg = pg
		self.error_count = error_count
		self.ticket_num = ticket_num
		self.outage_caused = outage_caused
		self.system_caused = system_caused
		self.addt_notes = addt_notes
		self.ticket_type = ticket_type
		self.duration = duration	
		self.timezone = timezone	
		self.ticket_link = ticket_link

	def __str__(self):
		return """ created_dt == {0} 
		,division = {1}
		,pg = {2}
		,error_count = {3}
		,ticket_num = {4}
		,outage_caused = {5}
		,system_caused = {6}
		,addt_notes = {7}
		,ticket_type = {8}
		,duration = {9}""".format(
			self.created_dt, self.division, str(self.pg), self.error_count,self.ticket_num,self.outage_caused,self.system_caused,self.addt_notes,
			self.ticket_type,self.duration)




