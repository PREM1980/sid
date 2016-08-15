from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from elasticsearch import Elasticsearch, ElasticsearchException
from elasticsearch_dsl import Search
from elasticsearch_dsl import Search, Q
from django.core import serializers
from models import Tickets, Division, Duration, Pg, ErrorCount, OutageCaused, SystemCaused,AddtNotes, NinjaUsers, AntennaRootCaused,OutageCategories
from django.db import transaction
from uuid import UUID
from django.db import connection
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from xlsxwriter.workbook import Workbook
from dateutil.parser import parse

import logging
import socket
import uuid
import datetime
import json
import constants
import pytz
import copy

logger = logging.getLogger('app_logger')

logger_feedback = logging.getLogger('feedback_logger')

import queries
import utils
from pytz import timezone
import socket

class LoginView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(LoginView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return utils.page_redirects_login(request)
		return utils.page_redirects(request,user_id)		

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']
		print 'loginview prem'
		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']			
			return utils.page_redirects(request,request.session['userid'])
		else:
			return utils.page_redirects_login(request)

class SIDView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(SIDView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		print 'loginview prem-1'
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		return render(request,'tickets/ninja_mainpage.html',{'hide':utils.hide_sid_create_section(),
										'admin_user':utils.check_if_admin(user_id)})								


class GetUUIDView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(GetUUIDView, self).dispatch(request, *args, **kwargs)

	def get(self, request):		
		return JsonResponse({'status': 'success','uuid':uuid.uuid4()})

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
		print 'request.POST == ', request.POST

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
		alldata['antenna_root_cause'] = request.POST.get('sid_antenna_root_cause')
		alldata['outage_categories'] = request.POST.get('sid_outage_categories')
		alldata['mitigate_check'] = request.POST.get('sid_mitigate_check')
		alldata['hardened_check'] = request.POST.get('sid_hardened_check')
		alldata['antenna_tune_error'] = request.POST.get('sid_antenna_tune_error')
		alldata['antenna_qam_error'] = request.POST.get('sid_antenna_qam_error')
		alldata['antenna_network_error'] = request.POST.get('sid_antenna_network_error')
		alldata['antenna_insuff_qam_error'] = request.POST.get('sid_antenna_insuff_qam_error')
		alldata['antenna_cm_error'] = request.POST.get('sid_antenna_cm_error')

		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:
			print 'api_key ==', api_key
			if api_key is not None:
				error  = validate_insert_input(alldata)
				user_id = alldata['userid']
				if error is not None:
					return JsonResponse({'status': error})
			else:
				logger.debug("ip = {0} && post data  == {1}".format(ip,alldata))
				print 'insert validated data == ', alldata
				#Javascript time that is passed - 2016-07-13T16:47:00-07:00
				# alldata['date'] = datetime.datetime.strptime(
				# 	str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
				alldata['date'] = utils.get_utc_ts(alldata['date'])

			try:
				error_count_actuals = constants.VALID_ERROR_COUNT_NUMERALS[alldata.get('error_count')]
			except:
				if alldata['error_count'].strip() == '':
					error_count_actuals = 0
				else:					
					alldata['error_count'] = alldata['error_count'].strip()
					if alldata['error_count'].replace(',','').isdigit():
						error_count_actuals = int(alldata['error_count'].replace(',',''))
					else:
						error_count_actuals = int(alldata['error_count'])
			try:
				t = Ticket(created_dt=alldata['date']
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
					,antenna_root_cause=alldata.get('antenna_root_cause')
					,mitigate_check=alldata.get('mitigate_check')
					,hardened_check=alldata.get('hardened_check')
					,antenna_tune_error=alldata.get('antenna_tune_error')
					,antenna_qam_error=alldata.get('antenna_qam_error')
					,antenna_network_error=alldata.get('antenna_network_error')
					,antenna_insuff_qam_error=alldata.get('antenna_insuff_qam_error')
					,antenna_cm_error=alldata.get('antenna_cm_error')
					,outage_categories=alldata.get('outage_categories')
					)
			except Exception as e:
				print 'Ticket object creation exception == ', e
			try:
				logger.debug("ip = {0} &&  insert document == {1}".format(ip,t))
			except Exception as e:
				print 'Logger exception == ', e

			try:
				with transaction.atomic():
					div,created = Division.objects.get_or_create(division_name=t.division)
					dur,created = Duration.objects.get_or_create(duration=t.duration)
					err,created = ErrorCount.objects.get_or_create(error=t.error_count,error_count_actuals=error_count_actuals)
					out,created = OutageCaused.objects.get_or_create(outage_caused=t.outage_caused)
					sys,created = SystemCaused.objects.get_or_create(system_caused=t.system_caused)
					antenna,created = AntennaRootCaused.objects.get_or_create(antenna_root_caused=t.antenna_root_cause)
					outage,created = OutageCategories.objects.get_or_create(outage_categories=t.outage_categories)					
					ticket_info = {
						'row_create_ts': alldata['date'],
						'ticket_num': t.ticket_num,
						'ticket_type': t.ticket_type,
						'division': div.ID,
						'duration': dur.ID,
						'error_count': err.ID,
						'outage_caused': out.ID,
						'system_caused': sys.ID,
						'create_user_id': user_id,
						'update_user_id': user_id,
						'timezone': alldata['date'],
						'ticket_link': t.ticket_link,
						'antenna_root_cause': antenna.ID,
						'outage_categories': outage.ID,
						'mitigate_check': t.mitigate_check,
						'hardened_check': t.hardened_check,
						'antenna_tune_error': t.antenna_tune_error,
						'antenna_qam_error': t.antenna_qam_error,
						'antenna_network_error': t.antenna_network_error,
						'antenna_insuff_qam_error': t.antenna_insuff_qam_error,
						'antenna_cm_error': t.antenna_cm_error
					}					
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
				print 'MYSQL Insert Exception == ', e 
				logger.debug("MySQLException == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})

def validate_insert_input(alldata):	
	print 'insert alldata == ', alldata
	valid_division = []
	valid_pgs = []	
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
	print 'alldata[date] == ', alldata['date']
	try:
		# alldata['date'] = datetime.datetime.strptime(
		# 	str(alldata.get('date')), '%Y/%m/%d %H:%S:%M').strftime('%Y-%m-%d %H:%S:%M')

		d = parse(alldata['date'])
		print 'd == ', d
		if d.tzinfo is None:
			error = 'Date should be in the following format:- "22016-07-18T12:07:00-04:00", Timezone needs to be included '
		alldata['date'] = utils.get_utc_ts(alldata['date'])
	except Exception as e:
		error = 'Date should be in the following format:- "2016-07-18T12:07:00-04:00", Timezone needs to be included '

	if  alldata.get('division').encode('ascii').lower() not in constants.VALID_DIVISION_LC:
		error = 'Division should be one of the following option :- ' + ','.join(constants.VALID_DIVISION)

	#If the API's send division names wrongly, it needs to be fixed.
	if  alldata.get('division').encode('ascii').lower() in constants.VALID_DIVISION_LC:
		ix = constants.VALID_DIVISION_LC.index(alldata.get('division').lower())
		alldata['division'] = constants.VALID_DIVISION[ix]

	#Check if the correct peer groups are sent for a particular division.
	if alldata.get('division') == constants.VALID_DIVISION[0]:
		for each in alldata.get('pg'):
			if each not in constants.NATIONAL:
				error = 'Not a valid peergroup for the given National division. Valid peergroups are:- ' + ' '.join(constants.NATIONAL)

	if alldata.get('division') == constants.VALID_DIVISION[1]:
		for each in alldata.get('pg'):
			if each not in constants.CENTRAL:
				error = 'Not a valid peergroup for the given central division. Valid peergroups are:- ' + ' '.join(constants.CENTRAL)
	
	if alldata.get('division') == constants.VALID_DIVISION[2]:
		for each in alldata.get('pg'):
			if each not in constants.NORTHEAST:
				error = 'Not a valid peergroup for the given NorthEast division. Valid peergroups are:- ' + ' '.join(constants.NORTHEAST)				

	if alldata.get('division') == constants.VALID_DIVISION[3]:
		for each in alldata.get('pg'):
			if each not in constants.WEST:
				error = 'Not a valid peergroup for the given West division. Valid peergroups are:- ' + ' '.join(constants.WEST)				

	if alldata.get('duration') not in [None,'']:
		if  alldata.get('duration') not in constants.VALID_DURATION:
			error = 'Duration should be one of the following option :- ' + ','.join(constants.VALID_DURATION)
	else:
		alldata['duration'] = ' '
	
	if alldata.get('error_count') not in [None,'']:
		if alldata.get('error_count') not in constants.VALID_ERROR_COUNT:
			if alldata['error_count'].replace(',','').isdigit():
				alldata['error_count'] = int(alldata['error_count'].replace(',',''))
			else:
				error = 'Error count should be numeric(ex:- 2,000) or one of the following option :- ' + ','.join(constants.VALID_ERROR_COUNT)	
	else:
		alldata['error_count'] = ' '
		
	#replace commas in numbers
	
	if alldata.get('outage_caused') not in [None,'']:
		if alldata.get('outage_caused') not in constants.VALID_OUTAGE_CAUSED:
			error = 'Outage caused should be one of the following option :- ' + ','.join(constants.VALID_OUTAGE_CAUSED)	
	else:
		alldata['outage_caused'] = ' '

	if alldata.get('system_caused') not in [None,'']:
		if alldata.get('system_caused') not in constants.VALID_SYSTEM_CAUSED:
			error = 'System caused should be one of the following option :- ' + ','.join(constants.VALID_SYSTEM_CAUSED)	
	else:
		alldata['system_caused'] = ' '

	#strip seconds from API timestamp to match the GUI timestamp
	# alldata['date'] = alldata['date'][:-3]

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
			logger.debug("ip = {0} &&  output == {1}".format(ip,output))			
			return JsonResponse({'results': output,'status':'success'})
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

def get_ticket_data(alldata,api_key,ip,user_id):	
	initial = alldata.get('initial')
	print 'prem get alldata ==', alldata
	try:
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
			'antenna_root_cause': alldata.get('antenna_root_cause'),
			'outage_categories': alldata.get('outage_categories'),
			'mitigate_check': alldata.get('mitigate_check'),
			'hardened_check': alldata.get('hardened_check'),
			'antenna_tune_error_s': alldata.get('antenna_tune_error_s'), 
			'antenna_tune_error_e': alldata.get('antenna_tune_error_e'), 
			'antenna_qam_error_s': alldata.get('antenna_qam_error_s'), 
			'antenna_qam_error_e': alldata.get('antenna_qam_error_e'), 
			'antenna_network_error_s': alldata.get('antenna_network_error_s'), 
			'antenna_network_error_e': alldata.get('antenna_network_error_e'), 
			'antenna_insuff_qam_error_s': alldata.get('antenna_insuff_qam_error_s'), 
			'antenna_insuff_qam_error_e': alldata.get('antenna_insuff_qam_error_e'), 
			'antenna_cm_error_s': alldata.get('antenna_cm_error_s'), 
			'antenna_cm_error_e': alldata.get('antenna_cm_error_e') 
		}
	except Exception as e:
		print 'Exception == ', e 

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
			start_date_qry_set = end_date_qry_set = duration_qry_set = error_count_qry_set = ticket_num_qry_set = division_qry_set = \
			pg_qry_set = outage_qry_set = system_qry_set = antenna_root_cause_qry_set = outage_categories_qry_set = mitigate_check_qry_set = hardened_check_qry_set = \
			antenna_tune_error_qry_set = antenna_qam_error_qry_set = antenna_network_error_qry_set = antenna_insuff_qam_error_qry_set = antenna_cm_error_qry_set = False
			start_date_qry = end_date_qry = duration_qry = error_count_qry = ticket_num_qry = \
			division_qry = pg_qry = outage_qry = system_qry = antenna_root_cause_qry = outage_categories_qry = mitigate_check_qry = hardened_check_qry = \
			antenna_tune_error_qry = antenna_qam_error_qry = antenna_network_error_qry = antenna_insuff_qam_error_qry = antenna_cm_error_qry = ''
			
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

			if doc['ticket_num'] == '':
				ticket_num_qry = ""
			else:
				ticket_num_qry_set = True
				ticket_num_qry = " tb1.ticket_num = '{ticket_num}' ".format(ticket_num=doc['ticket_num'])

			if doc['error_count'] in ['Error Count','All']:
				error_count_qry = ""
			else:
				error_count_qry_set = True
				# error_count_qry = " tb4.error = '{error}' ".format(error=doc['error_count'])
				error_count_qry = "tb4.error_actuals  {error} ".format(error=constants.VALID_ERROR_COUNT_NUMERALS_QUERY[doc['error_count']])

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

			if doc['antenna_root_cause'] in ['Antenna Root Cause','All','',None]:
				antenna_root_cause_qry = ''
			else:
				antenna_root_cause_qry_set = True
				antenna_root_cause_qry = " tb10.antenna_root_caused = '{antenna_root_cause}' ".format(antenna_root_cause=doc['antenna_root_cause'])

			if doc['outage_categories'] in ['Outage Categories','All','',None]:
				outage_categories_qry = ''
			else:
				outage_categories_qry_set = True
				outage_categories_qry = " tb11.outage_categories  = '{outage_categories}' ".format(outage_categories=doc['outage_categories'])			

			if doc['mitigate_check'] in ['Mitigate Check','All','',None]:
				mitigate_check_qry = ''
			else:
				mitigate_check_qry_set = True
				mitigate_check_qry = " tb1.mitigate_check  = '{mitigate_check}' ".format(mitigate_check=doc['mitigate_check'])					

			if doc['hardened_check'] in ['Hardened Check','All','',None]:
				hardened_check_qry = ''
			else:
				hardened_check_qry_set = True
				hardened_check_qry = " tb1.hardened_check  = '{hardened_check}' ".format(hardened_check=doc['hardened_check'])					

			if doc['antenna_tune_error_s'] in ['','0',None] and doc['antenna_tune_error_e'] in ['','0',None]:
				antenna_tune_error_qry = ''
			else:
				antenna_tune_error_qry_set = True
				antenna_tune_error_qry = " tb1.antenna_tune_error between '{antenna_tune_error_s}' and '{antenna_tune_error_e}' ".format(antenna_tune_error_s=doc['antenna_tune_error_s'],antenna_tune_error_e=doc['antenna_tune_error_e'])

			if doc['antenna_qam_error_s'] in ['','0',None] and doc['antenna_qam_error_e'] in ['','0',None]:
				antenna_qam_error_qry = ''
			else:
				antenna_qam_error_qry_set = True
				antenna_qam_error_qry = " tb1.antenna_qam_error between '{antenna_qam_error_s}' and '{antenna_qam_error_e}' ".format(antenna_qam_error_s=doc['antenna_qam_error_s'],antenna_qam_error_e=doc['antenna_qam_error_e'])

			if doc['antenna_network_error_s'] in ['','0',None] and doc['antenna_network_error_e'] in ['','0',None]:
				antenna_network_error_qry = ''
			else:
				antenna_network_error_qry_set = True
				antenna_network_error_qry = " tb1.antenna_network_error between '{antenna_network_error_s}' and '{antenna_network_error_e}' ".format(antenna_network_error_s=doc['antenna_network_error_s'],antenna_network_error_e=doc['antenna_network_error_e'])

			if doc['antenna_insuff_qam_error_s'] in ['','0',None] and doc['antenna_insuff_qam_error_e'] in ['','0',None]:
				antenna_insuff_qam_error_qry = ''
			else:
				antenna_insuff_qam_error_qry_set = True
				antenna_insuff_qam_error_qry = " tb1.antenna_insuff_qam_error between '{antenna_insuff_qam_error_s}' and '{antenna_insuff_qam_error_e}' ".format(antenna_insuff_qam_error_s=doc['antenna_insuff_qam_error_s'],antenna_insuff_qam_error_e=doc['antenna_insuff_qam_error_e'])

			if doc['antenna_cm_error_s'] in ['','0',None] and doc['antenna_cm_error_e'] in ['','0',None]:
				antenna_cm_error_qry = ''
			else:
				antenna_cm_error_qry_set = True
				antenna_cm_error_qry = " tb1.antenna_cm_error between '{antenna_cm_error_s}' and '{antenna_cm_error_e}' ".format(antenna_cm_error_s=doc['antenna_cm_error_s'],antenna_cm_error_e=doc['antenna_cm_error_e'])
						
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
				,'antenna_root_cause_qry_set':antenna_root_cause_qry_set
				,'outage_categories_qry_set':outage_categories_qry_set
				,'mitigate_check_qry_set':mitigate_check_set
				,'hardened_check_qry_set':mitigate_check_qry_set
				,'antenna_tune_error_qry_set':antenna_tune_error_qry_set
				,'antenna_qam_error_qry_set':antenna_qam_error_qry_set
				,'antenna_network_error_qry_set':antenna_network_error_qry_set
				,'antenna_insuff_qam_error_qry_set':antenna_insuff_qam_error_qry_set
				,'antenna_cm_error_qry_set':antenna_cm_error_qry_set
				,'start_date_qry':start_date_qry
				,'end_date_qry':end_date_qry
				,'division_qry':division_qry
				,'pg_qry':pg_qry
				,'outage_qry':outage_qry
				,'system_qry':system_qry
				,'error_count_qry':error_count_qry
				,'duration_qry':duration_qry
				,'ticket_num_qry':ticket_num_qry						
				,'antenna_root_cause_qry':antenna_root_cause_qry
				,'outage_categories_qry':outage_categories_qry
				,'mitigate_check_qry':mitigate_check_qry
				,'antenna_tune_error_qry':antenna_tune_error_qry
				,'antenna_qam_error_qry':antenna_qam_error_qry
				,'antenna_network_error_qry':antenna_network_error_qry
				,'antenna_insuff_qam_error_qry':antenna_insuff_qam_error_qry
				,'antenna_cm_error_qry':antenna_cm_error_qry
				}
				p_qry = set_query_params(**kwargs)
				p_qry = p_qry + ' ORDER BY tb1.row_create_ts desc, tb1.ticket_num desc LIMIT 100'
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
				,'antenna_root_cause_qry_set':antenna_root_cause_qry_set
				,'outage_categories_qry_set':outage_categories_qry_set
				,'mitigate_check_qry_set':mitigate_check_qry_set
				,'hardened_check_qry_set':mitigate_check_qry_set
				,'antenna_tune_error_qry_set':antenna_tune_error_qry_set
				,'antenna_qam_error_qry_set':antenna_qam_error_qry_set
				,'antenna_network_error_qry_set':antenna_network_error_qry_set
				,'antenna_insuff_qam_error_qry_set':antenna_insuff_qam_error_qry_set
				,'antenna_cm_error_qry_set':antenna_cm_error_qry_set
				,'start_date_qry':start_date_qry
				,'end_date_qry':end_date_qry
				,'division_qry':division_qry
				,'pg_qry':pg_qry
				,'outage_qry':outage_qry
				,'system_qry':system_qry
				,'error_count_qry':error_count_qry
				,'duration_qry':duration_qry
				,'ticket_num_qry':ticket_num_qry		
				,'antenna_root_cause_qry':antenna_root_cause_qry
				,'outage_categories_qry':outage_categories_qry
				,'mitigate_check_qry':mitigate_check_qry
				,'hardened_check_qry':mitigate_check_qry
				,'antenna_tune_error_qry':antenna_tune_error_qry
				,'antenna_qam_error_qry':antenna_qam_error_qry
				,'antenna_network_error_qry':antenna_network_error_qry
				,'antenna_insuff_qam_error_qry':antenna_insuff_qam_error_qry
				,'antenna_cm_error_qry':antenna_cm_error_qry				
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
		or kwargs['error_count_qry_set'] \
		or kwargs['antenna_root_cause_qry_set'] \
		or kwargs['outage_categories_qry_set'] \
		or kwargs['mitigate_check_qry_set'] \
		or kwargs['hardened_check_qry_set'] \
		or kwargs['antenna_tune_error_qry_set'] \
		or kwargs['antenna_qam_error_qry_set'] \
		or kwargs['antenna_network_error_qry_set'] \
		or kwargs['antenna_insuff_qam_error_qry_set'] \
		or kwargs['antenna_cm_error_qry_set']:
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

	# print 'prem qry = ', qry	
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
			prev_qry_set = True
		else:
			qry = qry + kwargs['system_qry']
			prev_qry_set = True

	if kwargs['antenna_root_cause_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['antenna_root_cause_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['antenna_root_cause_qry']
			prev_qry_set = True

	if kwargs['outage_categories_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['outage_categories_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['outage_categories_qry']
			prev_qry_set = True

	if kwargs['mitigate_check_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['mitigate_check_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['mitigate_check_qry']
			prev_qry_set = True

	if kwargs['hardened_check_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['hardened_check_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['hardened_check_qry']
			prev_qry_set = True

	if kwargs['antenna_tune_error_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['antenna_tune_error_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['antenna_tune_error_qry']
			prev_qry_set = True

	if kwargs['antenna_qam_error_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['antenna_qam_error_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['antenna_qam_error_qry']
			prev_qry_set = True

	if kwargs['antenna_network_error_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['antenna_network_error_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['antenna_network_error_qry']
			prev_qry_set = True

	if kwargs['antenna_cm_error_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['antenna_cm_error_qry'] 
			prev_qry_set = True
		else:
			qry = qry + kwargs['antenna_cm_error_qry']
			prev_qry_set = True	
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
			data['created_dt'] = each[1].replace(tzinfo=pytz.utc)
			# print 'prem created_dt == ', data['created_dt']
			if each[4].year == 9999:
				data['row_end_ts'] = ""
			else:
				data['row_end_ts'] = each[4].replace(tzinfo=pytz.utc)
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
			data['admin_user'] = utils.check_if_admin(user_id)
			data['ticket_link'] = each[14]
			data['hardened_check'] = each[15]
			data['mitigate_check'] = each[16]
			data['antenna_tune_error'] = each[17]
			data['antenna_cm_error'] = each[18]
			data['antenna_network_error'] = each[19]
			data['antenna_qam_error'] = each[20]
			data['antenna_insuff_qam_error'] = each[21]
			data['antenna_root_caused'] = each[22]
			data['outage_categories'] = each[23]
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
			data['created_dt'] = each[1].replace(tzinfo=pytz.utc)
			#data['row_end_ts'] = each[4]
			if each[4].year == 9999:
				data['row_end_ts'] = ""
			else:				
				data['row_end_ts'] = each[4].replace(tzinfo=pytz.utc)
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
			data['admin_user'] = utils.check_if_admin(user_id)
			data['ticket_link'] = each[14]
			data['hardened_check'] = each[15]
			data['mitigate_check'] = each[16]
			data['antenna_tune_error'] = each[17]
			data['antenna_cm_error'] = each[18]
			data['antenna_network_error'] = each[19]
			data['antenna_qam_error'] = each[20]
			data['antenna_insuff_qam_error'] = each[21]
			data['antenna_root_caused'] = each[22]
			data['outage_categories'] = each[23]
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
			width, height = letter
			p.setLineWidth(.3)
			p.setFont('Helvetica',12)
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
				if alldata['tz'] == 'local':
					each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],alldata['local_time_offset'])
				elif alldata['tz'] == 'est':
					each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],-4) #EST offset
								
				p.drawString(x1, y, '{:%a %b %Y %H:%M:%S}'.format(each['created_dt']))
				y = y - incr
				y = page_break_called(p,y,height)

				p.setFont('Helvetica-Bold',12)
				p.drawString(x, y, 'End Date:')
				p.setFont('Helvetica',12)
				if each['row_end_ts'] != "":
					#sheet.write(row,2,'{:%a %b %Y %H:%M:%S}'.format(each['row_end_ts']))
					each['row_end_dt'] = utils.convert_datetime_using_offset(each['row_end_ts'],alldata['local_time_offset'])
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
			return response
		else:
			print 'get-ticket-data no valid session'
			return JsonResponse({'status': 'session timeout'})

def initpages(height):
	incr = 15
	x = 20
	x1 = 130
	y = height - 30
	return incr, x, y, x1

def page_break_called(p,y,height):
	if y < 40:
		p.showPage()
		(incr, x, y, x1) = initpages(height)
		width, height = letter
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
				print 'alldata-tz == ', alldata['tz']
				if alldata['tz'] == 'local':
					each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],alldata['local_time_offset'])
				elif alldata['tz'] == 'est':
					each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],-240) #EST offset
				sheet.write(row,1,'{:%d %b %Y %H:%M:%S}'.format(each['created_dt']))
				if each['row_end_ts'] != "":
					if alldata['tz'] == 'local':
						each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],alldata['local_time_offset'])
					elif alldata['tz'] == 'est':
						each['created_dt'] = utils.convert_datetime_using_offset(each['created_dt'],-240) #EST offset
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
		alldata['ticket_link']= request.POST.get('ticket_link')
		alldata['orig_ticket_num']= request.POST.get('orig_ticket_num')		
		alldata['userid'] = request.POST.get('userid')
		alldata['update_end_dt'] = request.POST.get('update_end_dt')

		alldata['antenna_root_cause'] = request.POST.get('antenna_root_cause')
		alldata['outage_categories'] = request.POST.get('outage_categories')
		alldata['mitigate_check'] = request.POST.get('mitigate_check')
		alldata['hardened_check'] = request.POST.get('hardened_check')
		alldata['antenna_tune_error'] = request.POST.get('antenna_tune_error')
		alldata['antenna_qam_error'] = request.POST.get('antenna_qam_error')
		alldata['antenna_network_error'] = request.POST.get('antenna_network_error')
		alldata['antenna_insuff_qam_error'] = request.POST.get('antenna_insuff_qam_error')
		alldata['antenna_cm_error'] = request.POST.get('antenna_cm_error')
		
		logger.debug("ip = {0} &&  alldata == {1}".format(ip,alldata))
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:
			# Don't move this IF stmt below
			if alldata.get('update_end_dt') == 'Y':
			   ticket_num, ticket_link = convert_link_to_ticket_num(alldata.get('ticket_num'))
			   ticket = Tickets.objects.get(ticket_num=ticket_num)			   
			   ticket.row_end_ts = datetime.datetime.now(tz=pytz.utc).isoformat()			   			   
			   ticket.save()
			   return JsonResponse({'status': 'success'})			
			try:
				error_count_actuals = constants.VALID_ERROR_COUNT_NUMERALS[alldata.get('error_count')]
			except:
				alldata['error_count'] = alldata['error_count'].strip()
				if alldata['error_count'].strip() == '':
					error_count_actuals = 0
				else:
					if alldata['error_count'].replace(',','').isdigit():
						error_count_actuals = int(alldata['error_count'].replace(',',''))
					else:						
						error_count_actuals = int(alldata['error_count'])

			if api_key is not None:
				error = validate_update_input(alldata)
				print 'update validated data == ', alldata
				if error is not None:
					return JsonResponse({'status': error})

			if alldata['created_dt'] is not None:
				if api_key is None:
					alldata['created_dtdate'] = utils.get_utc_ts(alldata['created_dt'])

			if alldata['end_dt'] not in [None,'']:	
				if api_key is None and alldata['end_dt'] not in [None,'']:
					alldata['end_dt'] = utils.get_utc_ts(alldata['end_dt'])

			print 'update alldata == ', alldata

			t = Ticket(created_dt=alldata.get('created_dt')
				,end_dt=alldata.get('end_dt')
				,division=alldata.get('division')
				,pg=alldata.get('pg')
				,error_count=alldata.get('error_count')
				,ticket_num=alldata.get('ticket_num')
				,orig_ticket_num=alldata.get('orig_ticket_num')
				,outage_caused=alldata.get('outage_caused')
				,system_caused=alldata.get('system_caused')
				,addt_notes=alldata.get('addt_notes')
				,ticket_type=alldata.get('ticket_type')
				,duration=alldata.get('duration')
				,ticket_link=alldata.get('ticket_link')
				,antenna_root_cause=alldata.get('antenna_root_cause')
				,mitigate_check=alldata.get('mitigate_check')
				,hardened_check=alldata.get('hardened_check')
				,antenna_tune_error=alldata.get('antenna_tune_error')
				,antenna_qam_error=alldata.get('antenna_qam_error')
				,antenna_network_error=alldata.get('antenna_network_error')
				,antenna_insuff_qam_error=alldata.get('antenna_insuff_qam_error')
				,antenna_cm_error=alldata.get('antenna_cm_error')
				,outage_categories=alldata.get('outage_categories')
				)
			
			print 'update doc  == ', t
			logger.debug("ip == {0} && Update document == {1}".format(ip,t))
			
			if t.ticket_num != t.orig_ticket_num and api_key is None:						
				# If new ticket number, get the old ticket number
				try:
					old_ticket = Tickets.objects.get(ticket_num=t.orig_ticket_num)		
				except Exception as e:
					print 'e ==',e
				# Create the old ticket replica				
				new_ticket = copy.deepcopy(old_ticket)
				# End date the exiting ticket
				old_ticket.valid_flag = 'N'
				# Save the ticket
				old_ticket.save()								
				#set the new_ticket_num and valid flag
				new_ticket.ticket_num = t.ticket_num				
				new_ticket.ticket_link = t.ticket_link
				new_ticket.valid_flag = 'Y'		
				try:			
					#check duplicate entry for the new ticket		
					ticket = Tickets.objects.get(ticket_num=new_ticket.ticket_num)						
				except Exception as e:
					print 'exception == ', e
					ticket = None
				
				if ticket is None:
					#Create the ticket
					new_ticket.save()
				else:
					return JsonResponse({'status': 'Ticket already present'})

			print 'new ticket_num created == ', t.ticket_num
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
					err,created = ErrorCount.objects.get_or_create(error=t.error_count,error_count_actuals=error_count_actuals)
					out,created = OutageCaused.objects.get_or_create(outage_caused=t.outage_caused)
					sys,created = SystemCaused.objects.get_or_create(system_caused=t.system_caused)
					antenna,created = AntennaRootCaused.objects.get_or_create(antenna_root_caused=t.antenna_root_cause)
					outage,created = OutageCategories.objects.get_or_create(outage_categories=t.outage_categories)
					
					try:
						ticket = Tickets.objects.get(ticket_num=t.ticket_num)
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
						if t.created_dt not in [None,'']:
							ticket.row_create_ts = t.created_dt						
						if t.end_dt not in [None,'']:
							ticket.row_end_ts = t.end_dt
						if t.ticket_link not in [None,'']:
							ticket.ticket_link = t.ticket_link						

						if t.antenna_root_cause not in [None,'']:
							ticket.antenna_root_cause = antenna.ID
						if t.outage_categories not in [None,'']:
							ticket.outage_categories = outage.ID
						if t.antenna_tune_error not in [None,'']:
							ticket.antenna_tune_error = t.antenna_tune_error
						if t.antenna_qam_error not in [None,'']:
							ticket.antenna_qam_error = t.antenna_qam_error
						if t.antenna_network_error not in [None,'']:
							ticket.antenna_network_error = t.antenna_network_error
						if t.antenna_insuff_qam_error not in [None,'']:
							ticket.antenna_tune_error = t.antenna_insuff_qam_error
						if t.antenna_cm_error not in [None,'']:
							ticket.antenna_cm_error = t.antenna_cm_error

						ticket.save()						
						try:
							AddtNotes.objects.get(Id=ticket).delete()
							AddtNotes.objects.create(Id=ticket,notes=t.addt_notes)
						except Exception as e:
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
	error = None

	#If a ' ' or '   ' is passed, you need to strip the spaces. Most of the fields does not take spaces in SID...
	for key,value in alldata.items():
		if alldata[key] is not None and type(alldata[key]) is not list:
			if alldata[key].strip() == '':
				alldata[key] = '' 
	
	if alldata.get('created_dt') not in [None,'']:
		try:
			d = parse(alldata['created_dt'])
			if d.tzinfo is None:
				error = 'Created Date should be in the following format:- "2016-07-18T12:07:00-04:00", Timezone needs to be included '
			alldata['created_dt'] = utils.get_utc_ts(alldata['created_dt'])
		except:
			error = 'Created Date should be in the following format:- "2016-07-18T12:07:00-04:00", Timezone needs to be included '

	if alldata.get('end_dt') not in [None,'']:
		try:
			d = parse(alldata['end_dt'])
			if d.tzinfo is None:
				error = 'End Date should be in the following format:- "2016-07-18T12:07:00-04:00", Timezone needs to be included '
			alldata['end_dt'] = utils.get_utc_ts(alldata['end_dt'])
		except:
			error = 'End Date should be in the following format:- "2016-07-18T12:07:00-04:00", Timezone needs to be included '

	if alldata.get('ticket_num') in [None,''] \
		or alldata.get('userid') in [None,'']:
		error = 'Please pass the mandatory parameters - "ticket number"  &  "user id" part your input'	

	if alldata.get('division') not in [None,''] and len(alldata.get('pg')) == 0:
		error = 'Please pass the list of peer groups with Division'	

	if alldata.get('division') in [None,''] and len(alldata.get('pg')) != 0:
		error = 'Please pass the list of peer groups with Division'	

	if alldata.get('division') not in [None,''] and len(alldata.get('pg')) != 0:
		if  alldata.get('division').encode('ascii').lower() not in constants.VALID_DIVISION_LC:
			error = 'Division should be one of the following option :- ' + ','.join(constants.VALID_DIVISION)

		#If the API's send division names wrongly, it needs to be fixed.
		if  alldata.get('division').encode('ascii').lower() in constants.VALID_DIVISION_LC:
			ix = constants.VALID_DIVISION_LC.index(alldata.get('division').lower())
			alldata['division'] = constants.VALID_DIVISION[ix]

		#Check if the correct peer groups are sent for a particular division.
		if alldata.get('division') == constants.VALID_DIVISION[0]:
			for each in alldata.get('pg'):
				if each not in constants.NATIONAL:
					error = 'Not a valid peergroup for the given National division. Valid peergroups are:- ' + ' '.join(constants.NATIONAL)

		if alldata.get('division') == constants.VALID_DIVISION[1]:
			for each in alldata.get('pg'):
				if each not in constants.CENTRAL:
					error = 'Not a valid peergroup for the given central division. Valid peergroups are:- ' + ' '.join(constants.CENTRAL)
		
		if alldata.get('division') == constants.VALID_DIVISION[2]:
			for each in alldata.get('pg'):
				if each not in constants.NORTHEAST:
					error = 'Not a valid peergroup for the given NorthEast division. Valid peergroups are:- ' + ' '.join(constants.NORTHEAST)				

		if alldata.get('division') == constants.VALID_DIVISION[3]:
			for each in alldata.get('pg'):
				if each not in constants.WEST:
					error = 'Not a valid peergroup for the given West division. Valid peergroups are:- ' + ' '.join(constants.WEST)						

	if alldata.get('duration') not in [None,'']:
		if alldata.get('duration') not in constants.VALID_DURATION:
			error = 'Duration should be one of the following option :- ' + ','.join(constants.VALID_DURATION)
	else:
		alldata['duration'] = ' '

	if alldata.get('error_count') not in [None,'']:
		if alldata.get('error_count') not in constants.VALID_ERROR_COUNT:
			if alldata['error_count'].replace(',','').isdigit():
				alldata['error_count'] = int(alldata['error_count'].replace(',',''))
			else:
				error = 'Error count should be numeric(ex:- 2,000) or one of the following option :- ' + ','.join(constants.VALID_ERROR_COUNT)	
	else:
		alldata['error_count'] = ' '



	if alldata.get('outage_caused') not in [None,'']:
		if alldata.get('outage_caused') not in constants.VALID_OUTAGE_CAUSED:
			error = 'Outage caused should be one of the following option :- ' + ','.join(constants.VALID_OUTAGE_CAUSED)	
	else:
		alldata['outage_caused'] = ' '

	if alldata.get('system_caused') not in [None,'']:
		if alldata.get('system_caused') not in constants.VALID_SYSTEM_CAUSED:
			error = 'System caused should be one of the following option :- ' + ','.join(constants.VALID_SYSTEM_CAUSED)	
	else:
		alldata['system_caused'] = ' '

	if alldata.get('addt_notes') not in [None,'']:
		pass
	else:
		alldata['addt_notes'] = ' '

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

		if userid is None:
			if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
				return render(request,'tickets/ninja_loginpage.html',{'error':'N'})

			return render(request,'tickets/sid_loginpage.html')

		if settings.LOCAL_TEST_NINJA == True:
			if settings.NINJA == True:
				return render(request,'tickets/ninja_chartspage.html')
			else:
				return render(request,'tickets/sid_chartspage.html')
		else:				
			if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
				return render(request,'tickets/ninja_chartspage.html')
			else:
				return render(request,'tickets/sid_chartspage.html')
		
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
			if settings.HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
				return render(request,'tickets/ninja_loginpage.html',{'error':'N'})

			return render(request,'tickets/sid_loginpage.html')
		cursor = connection.cursor()

		cursor.execute("""select x.duration, count(*) from 
				(select tb2.duration
				from sid.tickets tb1
				inner join sid.duration tb2
				on tb2.duration_id = tb1.duration_id
				where tb1.valid_flag = 'Y') x
				group by x.duration""")
		results_duration= cursor.fetchall()		

		cursor.execute("""select x.error_text, count(*) from
			(				
			select tb2.error_actuals as error, 'less than 1,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 1 and 1000
			union all
			select tb2.error_actuals as error, '1,000 - 5,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 1000 and 5000
			union all
			select tb2.error_actuals as error, '5,000 - 10,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 5000 and 10000
			union all
			select tb2.error_actuals as error, '10,000 - 20,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 10000 and 20000
			union all
			select tb2.error_actuals as error, '20,000 - 50,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 20000 and 50000
			union all
			select tb2.error_actuals as error, '50,000 - 100,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 50000 and 100000
			union all
			select tb2.error_actuals as error, '100,000 - 150,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 100000 and 150000
			union all
			select tb2.error_actuals as error, '150,000 - 200,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 150000 and 200000
			union all
			select tb2.error_actuals as error, '200,000 - 250,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 200000 and 250000
			union all
			select tb2.error_actuals as error, '250,000 - 500,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals between 250000 and 500000
			union all
			select tb2.error_actuals as error, 'greater than 500,000' as error_text
			from sid.tickets tb1
			inner join sid.error_count tb2
			on tb2.error_count_id = tb1.error_count_id
			where tb1.valid_flag = 'Y'
			and tb2.error_actuals > 500000
			) x
							group by x.error_text
			""")
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
		output = cursor.fetchall()	
		results_pg = []
		for each in output:
			if each[0].lower() == 'all':
				results_pg.append([each[0], each[1] ])	
			else:
				results_pg.append([constants.PG_NAMES[each[0]] + ' - ' + each[0], each[1] ])	

		# """
		# SELECT  count(*) AS count, CONCAT(dt, ' - ', dt + INTERVAL 6 DAY) AS week from 
		# 	(select date(row_create_ts) as dt from sid.tickets where valid_flag = 'Y') x
		# 	GROUP BY WEEK(dt)
		# 	ORDER BY WEEK(dt)  
		# """
		# cursor.execute("SET @@session.time_zone = '+04:00';")
		#(select date(convert_tz(row_create_ts,"-00:00",'-00:00')) as dt from sid.tickets where valid_flag = 'Y') x
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
	def __init__(self, created_dt=None, end_dt=None, division=None, pg=None, error_count=None, ticket_num=None, orig_ticket_num=None, outage_caused=None, system_caused=None, addt_notes=None
				,ticket_type=None, duration=None, timezone=None, ticket_link=None,antenna_root_cause=None
				,mitigate_check=None,hardened_check=None,antenna_tune_error=None,antenna_qam_error=None,antenna_network_error=None,antenna_insuff_qam_error=None
				,antenna_cm_error=None,outage_categories=None):
		self.created_dt = created_dt
		self.end_dt = end_dt
		self.division = division 
		self.pg = pg
		self.error_count = error_count
		self.ticket_num = ticket_num
		self.orig_ticket_num = orig_ticket_num
		self.outage_caused = outage_caused
		self.system_caused = system_caused
		self.addt_notes = addt_notes
		self.ticket_type = ticket_type
		self.duration = duration	
		self.timezone = timezone	
		self.ticket_link = ticket_link
		self.antenna_root_cause = antenna_root_cause
		self.mitigate_check = mitigate_check
		self.hardened_check = hardened_check
		self.antenna_tune_error = antenna_tune_error
		self.antenna_qam_error = antenna_qam_error
		self.antenna_network_error = antenna_network_error
		self.antenna_insuff_qam_error = antenna_insuff_qam_error
		self.antenna_cm_error = antenna_cm_error
		self.outage_categories = outage_categories
		
	def __str__(self):
		return """ created_dt == {0} 
		,division = {1}
		,pg = {2}
		,error_count = {3}
		,ticket_num = {4}
		,orig_ticket_num = {10}
		,outage_caused = {5}
		,system_caused = {6}
		,ticket_type = {7}
		,duration = {8}
		,add_notes = {9} 
		,ticket_link = {11}
		,antenna_root_cause = {12}
		,mitigate_check = {13}
		,hardened_check = {14}
		,antenna_tune_error = {15}
		,antenna_qam_error = {16}
		,antenna_network_error = {17}
		,antenna_insuff_qam_error = {18}
		,antenna_cm_error = {19}
		,outage_categories = {20}
		""".format(
			self.created_dt, self.division, str(self.pg), self.error_count,self.ticket_num,self.outage_caused,self.system_caused,
			self.ticket_type,self.duration,self.addt_notes,self.orig_ticket_num,self.ticket_link,
			self.antenna_root_cause,self.mitigate_check,self.hardened_check,self.antenna_tune_error,
			self.antenna_qam_error,self.antenna_network_error,self.antenna_insuff_qam_error,self.antenna_cm_error,self.outage_categories)




