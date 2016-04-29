from django.shortcuts import render, render_to_response
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
from elasticsearch import Elasticsearch, ElasticsearchException
from elasticsearch_dsl import Search
from elasticsearch_dsl import Search, Q
from django.core import serializers
from models import Tickets, Division, Duration, Pg, ErrorCount, OutageCaused, SystemCaused,AddtNotes
import datetime
from django.db import transaction
from uuid import UUID
import uuid
from django.db import connection
import socket
from django.conf import settings

import logging
logger = logging.getLogger('app_logger')

logger_feedback = logging.getLogger('feedback_logger')

import queries
import utils

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

class PostTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PostTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:
			logger.debug("ip = {0} && post data  == {1}".format(ip,alldata))

			created_dt = datetime.datetime.strptime(
				str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
			
			# from dateutil.parser import parse
			# print 'string created_dt == ', alldata.get('date')
			# created_dt = parse(alldata.get('date'))
			# print 'created_dt == ', created_dt
			# print 'type created_dt == ', type(created_dt)
			# print 'dir created_dt == ', dir(created_dt)
			# print 'dir created_dt.tzinfo == ', dir(created_dt.tzinfo)
			# print 'created_dt.tzinfo == ', created_dt.tzinfo
			# print 'created_dt.tzinfo tzname == ', dir(created_dt.tzinfo.tzname)
			# print 'created_dt.tzinfo utcoffser== ', dir(created_dt.tzinfo.utcoffset)
			print 'created_dt.tzname == ', type(created_dt)
			
			t = Ticket(created_dt=created_dt
				,division=alldata.get('division')
				,pg=alldata.getlist('pg[]')
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
		
		api_key = None
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if api_key is not None:
			if api_key != settings.API_KEY:
				return JsonResponse({'status': 'Invalid Key..Contact support!!'})

		logger.debug("user_id = {0} ".format(user_id))
		
		if user_id is not None or api_key == settings.API_KEY:
			
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
						print 'start_date_qry == ', start_date_qry
						print 'end_date_qry == ', end_date_qry
						print 'ticket_num_qry == ', ticket_num_qry
						print 'division_qry == ', division_qry
						print 'outage_qry == ', outage_qry
						print 'system_qry == ', system_qry
						print 'pg_qry == ', pg_qry
						print 'start_date_qry == ', start_date_qry_set
						print 'end_date_qry == ', end_date_qry_set
						print 'ticket_num_qry == ', ticket_num_qry_set
						print 'division_qry == ', division_qry_set
						print 'outage_qry == ', outage_qry_set
						print 'system_qry == ', system_qry_set
						print 'pg_qry == ', pg_qry

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

			#print 'output == ', output
			logger.debug("ip = {0} &&  output == {1}".format(ip,output))
			
			return JsonResponse({'results': output,'status':'success'})
		else:
			print 'get-ticket-data no valid session '
			return JsonResponse({'status': 'session timeout'})

# def set_query_params(qry,start_date_qry_set,end_date_qry_set,division_qry_set,pg_qry_set,outage_qry_set,system_qry_set,ticket_num_qry_set
# 	,start_date_qry,end_date_qry,ticket_num_qry,division_qry,pg_qry,outage_qry,system_qry):
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
		qry = kwargs['qry'] + ' where tb1.valid_flag = "Y" ' 

	if kwargs['start_date_qry_set']:
		qry = qry + ' and ' + kwargs['start_date_qry']
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
			qry = qry + ' and ' + kwargs['ticket_num_qry']
			prev_qry_set = True					

	if kwargs['duration_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['duration_qry']
			prev_qry_set = True
		else:
			qry = qry + ' and ' + kwargs['duration_qry']
			prev_qry_set = True

	if kwargs['error_count_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['error_count_qry']
			prev_qry_set = True
		else:
			qry = qry + ' and ' + kwargs['error_count_qry']
			prev_qry_set = True

	if kwargs['division_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['division_qry']
			prev_qry_set = True
		else:
			qry = qry + ' and ' + kwargs['division_qry']
			prev_qry_set = True
			
	if kwargs['pg_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['pg_qry']
			prev_qry_set = True
		else:
			qry = qry + ' and ' + kwargs['pg_qry']
			prev_qry_set = True

	if kwargs['outage_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['outage_qry']
			prev_qry_set = True
		else:
			qry = qry + ' and ' + kwargs['outage_qry']  
			prev_qry_set = True

	if kwargs['system_qry_set']:
		if prev_qry_set:
			qry = qry + ' and ' + kwargs['system_qry'] 
		else:
			qry = qry + ' and ' + kwargs['system_qry']
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


class UpdateTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(UpdateTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		user_id = utils.check_session_variable(request)
		ip = utils.getip()
		alldata = request.POST
		logger.debug("ip = {0} &&  alldata == {1}".format(ip,alldata))
		api_key = request.META.get('HTTP_AUTHORIZATION')
		if user_id is not None or api_key == settings.API_KEY:
		
			if alldata.get('update') == 'Y':
			   ticket_num =  alldata.get('ticket_num')
			   ticket = Tickets.objects.get(ticket_num=ticket_num)
			   ticket.row_end_ts = datetime.datetime.now()
			   ticket.save()
			   return JsonResponse({'status': 'success'})

			created_dt = datetime.datetime.strptime(
				str(alldata.get('created_dt')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')

			print 'end_dt == ', alldata.get('end_dt')
			end_dt = alldata.get('end_dt')
			print 'len end_dt == ', len(end_dt)
			if len(end_dt) > 0:
				end_dt = datetime.datetime.strptime(end_dt, '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')

			print 'update created_dt == ', created_dt

			t = Ticket(created_dt=created_dt
				,end_dt=end_dt
				,division=alldata.get('division')
				,pg=alldata.getlist('pg[]')
				,error_count=alldata.get('error_count')
				,ticket_num=alldata.get('ticket_num')
				,outage_caused=alldata.get('outage_caused')
				,system_caused=alldata.get('system_caused')
				,addt_notes=alldata.get('addt_notes')
				,ticket_type=alldata.get('ticket_type')
				,duration=alldata.get('duration'))
			
			print 'update doc  == ', t
			logger.debug("ip == {0} && Update document == {1}".format(ip,t))
			
			try:
				with transaction.atomic():
					div,created = Division.objects.get_or_create(division_name=t.division)
					dur,created = Duration.objects.get_or_create(duration=t.duration)
					err,created = ErrorCount.objects.get_or_create(error=t.error_count)
					out,created = OutageCaused.objects.get_or_create(outage_caused=t.outage_caused)
					sys,created = SystemCaused.objects.get_or_create(system_caused=t.system_caused)
					
					try:
						ticket = Tickets.objects.get(ticket_num=t.ticket_num)
						ticket.division = div.ID
						ticket.duration = dur.ID
						ticket.error_count = err.ID
						ticket.outage_caused = out.ID
						ticket.system_caused = sys.ID
						ticket.update_user_id = user_id
						ticket.row_create_ts = t.created_dt
						if len(end_dt) > 0:
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

class RecordFeedBack(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(RecordFeedBack, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		ip = utils.getip()
		logger_feedback.debug("Ip-address == {0} && Name == {1} && Email == {2} && Message == {3} && Rating == {4}".format(ip,request.POST['name'],request.POST['email'], request.POST['message'], request.POST['radio_list_value']))
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




