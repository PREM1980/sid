from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core.files.storage import FileSystemStorage
from django.core import serializers
from models import Ams
from django.db import transaction
from uuid import UUID
from django.db import connection
from django.conf import settings
from dateutil.parser import parse
import os.path
import logging
import csv
import datetime
from dateutil import parser
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
import time




class AMSUpload(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		print 'im on dispatch'
		return super(AMSUpload, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return utils.page_redirects_login(request)
		else:
			return utils.page_redirects(request,request.session['userid'], active_tab='ams')				

	def post(self, request):		
		print 'post request'
		user_id = utils.check_session_variable(request)

		#Get the API Key
		api_key = request.META.get('HTTP_AUTHORIZATION')
		print 'api_key == ', api_key
		if user_id is not None or api_key == settings.API_KEY:			
			if request.method == 'POST' :						
				if api_key is not None:
					row, error  = validate_insert_input(request)
					# user_id = alldata['userid']
					if error is not None:
						return JsonResponse({'status': error})
					else:
						try:
							load_ams_data(row,user_id)
							return JsonResponse({'status': 'inserted'})
						except:							
							return JsonResponse({'status': 'Unable to load - Contact application support'})
					

				fs = FileSystemStorage()			
				
				myfile = request.FILES['amsFile']					

				if os.path.isfile(settings.MEDIA_ROOT + myfile.name):				
					#If the file is already present, return error message with that error.
					return utils.page_redirects(request,request.session['userid'], active_tab='ams', error_msg='File already present... ')				
				else:
					filename = fs.save(myfile.name, myfile)
					uploaded_file_url = fs.url(filename)
					user_id = utils.check_session_variable(request)
					time.sleep(10)			
					if os.path.isfile(settings.MEDIA_ROOT + myfile.name):
						with open('/var/www/ams-files/' + myfile.name ) as f:
							reader = csv.reader(f)
							first_row = True
							for row in reader:
								if first_row:
									first_row = False
									pass
								else:
									load_ams_data(row, user_id)
					# return render(request, 'library/search.html', {'result': results})
					return utils.page_redirects(request,request.session['userid'],active_tab='ams', error_msg='File loaded... ')				

def validate_insert_input(request):
	row = []

	row.extend(
		[request.POST.get('id')
		,request.POST.get('url')
		,request.POST.get('brouha')
		,request.POST.get('action')
		,request.POST.get('last_action_before_clear')
		,request.POST.get('resolve_close_reason')
		,request.POST.get('in_process')
		,request.POST.get('chronic')
		,request.POST.get('service_affecting')
		,request.POST.get('from_dt')
		,request.POST.get('till_dt')
		,request.POST.get('duration')
		,request.POST.get('customers')
		,request.POST.get('stbs')
		,request.POST.get('tta')
		,request.POST.get('tti')
		,request.POST.get('tts')
		,request.POST.get('ttr')
		,request.POST.get('by')
		,request.POST.get('division')
		,request.POST.get('region')
		,request.POST.get('dac')
		,request.POST.get('device')
		,request.POST.get('ip')
		,request.POST.get('upstreams')
		,request.POST.get('reason')
		,request.POST.get('comment')
		,request.POST.get('root_cause')
		,request.POST.get('corrective_action_taken')
		,request.POST.get('si_ticket')
		,request.POST.get('jb_ticket')
		,request.POST.get('found_in_support_system')
		,request.POST.get('alert_event_text')
		,request.POST.get('alert_type')

		])

	print 'row == ',row
	error = None
	return row,error


def load_ams_data(row, user_id):
	print 'load_ams_data'	
	try:
		print 'try'
		ams = Ams.objects.get(ticket_num=row[0])
		ams.ticket_num = row[0]
		ams.url = row[1]
		ams.brouha = row[2]
		ams.action = row[3]
		ams.last_action_before_clear = row[4]
		ams.resolve_close_reason = row[5]
		ams.in_process = row[6]
		ams.chronic = row[7]
		ams.service_affecting = row[8]
		ams.from_dt = parser.parse(row[9])
		ams.from_dt_am_pm = ''
		ams.till_dt = parser.parse(row[10])
		ams.till_dt_am_pm = ''
		ams.duration = int(row[11])
		ams.customers=int(row[12])
		ams.stbs=int(row[13])
		ams.tta=int(row[14])
		ams.tti=int(row[15])
		ams.tts=int(row[16])
		ams.ttr=int(row[17])
		ams.created_by=row[18] 
		ams.division=row[19] 
		ams.region=row[20] 
		ams.dac=row[21] 
		ams.device=row[22] 
		ams.ip=row[23] 
		ams.upstreams=row[24] 
		ams.reason=row[25] 
		ams.comment=row[26].replace('%','%%') 
		ams.root_cause=row[27] 
		ams.corrective_action_taken=row[28] 
		ams.si_ticket=row[29] 
		ams.jb_ticket=row[30] 
		ams.found_in_support_system=row[31] 
		ams.alert_event_text=row[32] 
		ams.alert_type=row[33]
		ams.row_create_ts=datetime.datetime.now()
		ams.row_update_ts=datetime.datetime.now() 	
		ams.row_end_ts=datetime.datetime.now() 	
		ams.create_user_id=user_id
		ams.update_user_id=user_id
		ams.valid_flag='Y'
		ams.save()
	except Ams.DoesNotExist:
		print 'except'
		ams = Ams.objects.get_or_create(
		ticket_num=row[0]
		,url=row[1] 
		,brouha=row[2] 
		,action=row[3] 
		,last_action_before_clear=row[4] 
		,resolve_close_reason=row[5] 
		,in_process=row[6] 
		,chronic=row[7] 
		,service_affecting=row[8] 
		,from_dt=parser.parse(row[9])
		,from_dt_am_pm='' 
		,till_dt=parser.parse(row[10]) 
		,till_dt_am_pm=''
		,duration=int(row[11])
		,customers=int(row[12])
		,stbs=int(row[13])
		,tta=int(row[14])
		,tti=int(row[15])
		,tts=int(row[16])
		,ttr=int(row[17])
		,created_by=row[18] 
		,division=row[19] 
		,region=row[20] 
		,dac=row[21] 
		,device=row[22] 
		,ip=row[23] 
		,upstreams=row[24] 
		,reason=row[25] 
		,comment=row[26].replace('%','%%') 
		,root_cause=row[27] 
		,corrective_action_taken=row[28] 
		,si_ticket=row[29] 
		,jb_ticket=row[30] 
		,found_in_support_system=row[31] 
		,alert_event_text=row[32] 
		,alert_type=row[33]
		,row_create_ts=datetime.datetime.now()
		,row_update_ts=datetime.datetime.now() 	
		,row_end_ts=datetime.datetime.now() 	
		,create_user_id=user_id
		,update_user_id=user_id
		,valid_flag='Y'
		)

class AMSGetTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(AMSGetTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):				
		user_id = utils.check_session_variable(request)
		
		if user_id is None:
			return utils.page_redirects_login(request)

		if request.method == 'POST': 
			if request.POST.get('initial') == 'Y':
				try:				
					cursor = connection.cursor()
					cursor.execute(queries.ams_query['generic'])
					results = cursor.fetchall()								
					output = enum_results(user_id,results)						
					return JsonResponse({'results': output,'status':'success'})
				except Exception as e:
					print 'AMS Select Exception == ', e
					logger.debug("AMS Select SQLException == {0}".format(e))
					return JsonResponse({'status': 'failure'})			
			else:
				try:
					qry = get_ams_ticket_data(request.POST)
					cursor = connection.cursor()	
					cursor.execute(qry)
					results = cursor.fetchall()
					output = enum_results(user_id,results)						
					return JsonResponse({'results': output,'status':'success'})
				except:
					print 'AMS Select Exception == ', e
					logger.debug("AMS Select SQLException == {0}".format(e))
					return JsonResponse({'status': 'failure'})			


def get_ams_ticket_data(post_object):
	print 'get_ams_ticket_data'		
	ticket_num_qry_set = division_qry_set = region_qry_set = start_date_qry_set = action_qry_set = last_action_qry_set = resolve_close_qry_set = False
	ticket_num_qry = division_num_qry = region_num_qry = start_date_qry = action_qry = last_action_qry = resolve_close_qry_set = ''			

	qry = queries.ams_query['ams_conditions']		

	if post_object.get('ticket_num') == '':
		ticket_num_qry = ""
	else:
		ticket_num_qry_set = True
		ticket_num_qry = " tb1.ticket_num = '{ticket_num}' ".format(ticket_num=post_object.get('ticket_num'))

	if post_object.get('division') in ['Division','All']:
		division_qry = ""
	else:
		division_qry_set = True
		division_qry = " tb1.division = '{division}' ".format(division=post_object.get('division'))		

	if post_object.get('region') in ['Region','All']:
		region_qry = ""
	else:
		region_qry_set = True
		region_qry = " tb1.region = '{region}' ".format(region=post_object.get('region'))				
	
	if post_object.get('action') in ['Action','All']:
		action_qry = ""
	else:
		action_qry_set = True
		action_qry = " tb1.action = '{action}' ".format(action=post_object.get('action'))				

	if post_object.get('last_action') in ['Last Action before clear','All']:
		last_action_qry = ""
	else:
		last_action_qry_set = True
		last_action_qry = " tb1.last_action_before_clear = '{last_action}' ".format(last_action=post_object.get('last_action'))				

	if post_object.get('resolve_close') in ['Resolve/Close Reason','All']:
		resolve_close_qry = ""
	else:
		resolve_close_qry_set = True
		resolve_close_qry = " tb1.resolve_close_reason = '{resolve_close}' ".format(resolve_close=post_object.get('resolve_close'))				

	start_date_s = post_object.get('start_date_s')
	start_date_e = post_object.get('start_date_e')

	if post_object.get('start_date_s') == '' and post_object.get('start_date_e') == '':
		pass
	elif post_object.get('start_date_s') != '' and post_object.get('start_date_e') == '':
		start_date_s = start_date_e
		start_date_qry_set = True
		start_date_s = datetime.datetime.strptime(start_date_s , '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
		start_date_e = datetime.datetime.strptime(start_date_e , '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
		start_date_qry = " tb1.from_dt between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=post_object.get('start_date_s'),start_date_e=post_object.get('start_date_e'))
	elif post_object.get('start_date_s') == '' and post_object.get('start_date_e') != '':
		start_date_qry_set = True
		start_date_s = datetime.datetime.strptime(start_date_s , '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
		start_date_e = datetime.datetime.strptime(start_date_e , '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
		start_date_qry = " tb1.from_dt between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)
	else:
		start_date_qry_set = True
		start_date_s = datetime.datetime.strptime(start_date_s, '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
		start_date_e = datetime.datetime.strptime(start_date_e, '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
		start_date_qry = " tb1.from_dt between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)	
		
	prev_qry_set = False

	if ticket_num_qry_set or division_qry_set or region_qry_set or start_date_qry_set or action_qry_set or last_action_qry_set or resolve_close_qry_set:	
		qry = qry  + ' and '

	if start_date_qry_set:
		qry = qry + start_date_qry
		prev_qry_set = True 				

	if ticket_num_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + ticket_num_qry
			prev_qry_set = True
		else:
			qry = qry + ticket_num_qry
			prev_qry_set = True					
	
	if division_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + division_qry
			prev_qry_set = True
		else:
			qry = qry + division_qry
			prev_qry_set = True								

	if region_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + region_qry
			prev_qry_set = True
		else:
			qry = qry + region_qry
			prev_qry_set = True				

	if action_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + action_qry
			prev_qry_set = True
		else:
			qry = qry + action_qry
			prev_qry_set = True				

	if last_action_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + last_action_qry
			prev_qry_set = True
		else:
			qry = qry + last_action_qry
			prev_qry_set = True				

	if resolve_close_qry_set:
		if prev_qry_set:
			qry = qry + ' and ' + resolve_close_qry
			prev_qry_set = True
		else:
			qry = qry + resolve_close_qry
			prev_qry_set = True				

	qry = qry + ' order by tb1.from_dt desc limit 500'
	# print 'qry == ', qry
	return qry

def enum_results(user_id,results):	
	output = []
	data = {}
	for row in results:	
		data['ticket_num']				= row[0].decode('utf8', errors='ignore').encode('utf8')
		data['url']						= row[1].decode('utf8', errors='ignore').encode('utf8') 
		data['brouha']					= row[2].decode('utf8', errors='ignore').encode('utf8') 
		data['action']					= row[3].decode('utf8', errors='ignore').encode('utf8') 
		data['last_action_before_clear'] = row[4].decode('utf8', errors='ignore').encode('utf8') 
		data['resolve_close_reason'] 	= row[5].decode('utf8', errors='ignore').encode('utf8') 
		data['in_process']				= row[6].decode('utf8', errors='ignore').encode('utf8') 
		data['chronic']					= row[7].decode('utf8', errors='ignore').encode('utf8') 
		data['service_affecting']		= row[8].decode('utf8', errors='ignore').encode('utf8') 
		data['from_dt']					= row[9]
		data['from_dt_am_pm']			= '' 
		data['till_dt']					= row[10]
		data['till_dt_am_pm']			= ''
		data['duration']				= row[13]
		data['customers']				= row[14]
		data['stbs']					= row[15]
		data['tta']						= row[16]
		data['tti']						= row[17]
		data['tts']						= row[18]
		data['ttr']						= row[19]
		data['created_by']				= row[20].decode('utf8', errors='ignore').encode('utf8')
		data['division']				= row[21].decode('utf8', errors='ignore').encode('utf8') 
		data['region']					= row[22].decode('utf8', errors='ignore').encode('utf8') 
		data['dac']						= row[23].decode('utf8', errors='ignore').encode('utf8') 
		data['device']					= row[24].decode('utf8', errors='ignore').encode('utf8') 
		data['ip']						= row[25].decode('utf8', errors='ignore').encode('utf8') 
		data['upstreams']				= row[26].decode('utf8', errors='ignore').encode('utf8') 
		data['reason']					= row[27].decode('utf8', errors='ignore').encode('utf8') 		
		data['comment']					= row[28].decode('utf8', errors='ignore').encode('utf8')
		data['root_cause']				= row[29].decode('utf8', errors='ignore').encode('utf8') 
		data['corrective_action_taken']	= row[30].decode('utf8', errors='ignore').encode('utf8') 
		data['si_ticket']				= row[31].decode('utf8', errors='ignore').encode('utf8') 
		data['jb_ticket']				= row[32].decode('utf8', errors='ignore').encode('utf8') 
		data['found_in_support_system']	= row[33].decode('utf8', errors='ignore').encode('utf8') 
		data['alert_event_text']		= row[34].decode('utf8', errors='ignore').encode('utf8') 
		data['alert_type']				= row[35].decode('utf8', errors='ignore').encode('utf8') 
		# data['row_create_ts']			= datetime.datetime.now()
		# data['row_update_ts']			= datetime.datetime.now() 	
		# data['row_end_ts']				= datetime.datetime.now() 	
		output.append(data)
		data = {}
		
	return output