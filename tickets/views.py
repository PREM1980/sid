from django.shortcuts import render
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
# Create your views here.

import logging
logger = logging.getLogger(__name__)


class PostTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PostTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		alldata = request.POST
		print 'post alldata == ', alldata
		created_dt = datetime.datetime.strptime(
			str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
		
		doc = {
			'created_dt': created_dt,
			'division': alldata.get('division'),
			'pg': alldata.getlist('pg[]'),
			'error_count': alldata.get('error_count'),
			'ticket_num': alldata.get('ticket_num'),
			'outage_caused': alldata.get('outage_caused'),
			'system_caused': alldata.get('system_caused'),
			'addt_notes': alldata.get('addt_notes'),
			'ticket_type': alldata.get('ticket_type'),
			'duration': alldata.get('duration')
		}
		
		logger.debug("Insert document == {0}".format(doc))
		
		try:
			with transaction.atomic():
				div,created = Division.objects.get_or_create(division_name=doc['division'])
				dur,created = Duration.objects.get_or_create(duration=doc['duration'])
				err,created = ErrorCount.objects.get_or_create(error=doc['error_count'])
				out,created = OutageCaused.objects.get_or_create(outage_caused=doc['outage_caused'])
				sys,created = SystemCaused.objects.get_or_create(system_caused=doc['system_caused'])
				ticket_info = {
					'created_dt': created_dt,
					'ticket_num': alldata.get('ticket_num'),
					'ticket_type': alldata.get('ticket_type'),
					'division': div.ID,
					'duration': dur.ID,
					'error_count': err.ID,
					'outage_caused': out.ID,
					'system_caused': sys.ID,
				}

				try:
					ticket = Tickets.objects.get(ticket_num=doc['ticket_num'])
				except Tickets.DoesNotExist:
					ticket = None

				if ticket is None:
					ticket = Tickets.objects.create(**ticket_info)
				else:
					print 'Ticket already present'
					return JsonResponse({'status': 'Ticket already present'})
				
				for each in alldata.getlist('pg[]'):
					p,created = Pg.objects.get_or_create(pg_cd=each)
					ticket.pgs.add(p)
				
				AddtNotes.objects.create(Id=ticket,notes=doc['addt_notes'])
				
		except Exception as e:
			print 'Exception == ', e 
			logger.debug("MySQLException == {0}".format(e))
			JsonResponse({'status': 'failure'})

		return JsonResponse({'status': 'success'})


class GetTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(GetTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):

		alldata = request.POST
		print 'get alldata == ', alldata
		
		initial = alldata.get('initial')
		print 'alldata.get.start_date_s==',alldata.get('start_date_s')

		doc = {
			'division': alldata.get('division'),
			'pg': alldata.getlist('pg[]'),
			'error_count': alldata.get('error_count'),
			'ticket_num': alldata.get('ticket_num'),
			'outage_caused': alldata.get('outage_caused'),
			'system_caused': alldata.get('system_caused'),
			'ticket_type': alldata.get('ticket_type'),
			'duration': alldata.get('duration'),
			'start_date_s': alldata.get('start_date_s'),
			'start_date_e': alldata.get('start_date_e'),
			'end_date_s': alldata.get('end_date_s'),
			'end_date_e': alldata.get('end_date_e')
			
		}
		print 'initial == ', initial
		data = {}
		output = []
		
		print 'doc == ', doc
		try:
			if initial == 'Y':
				cursor = connection.cursor()
				
				qry = """
					select   tb1.ticket_num
							,tb1.created_dt
							,tb1.ticket_type
							,tb1.row_create_ts
							,tb1.row_end_ts
							,tb2.division_name
							,tb3.duration
							,tb4.error
							,tb5.outage_caused
							,tb6.system_caused
							,tb8.pg_cd
							,tb9.notes
							from sid.tickets tb1
							inner join
							sid.division tb2
							on tb1.division_id = tb2.division_id
							inner join
							sid.duration tb3
							on tb1.error_count_id = tb3.duration_id
							inner join
							sid.error_count tb4
							on tb1.error_count_id = tb4.error_count_id
							inner join
							sid.outage_caused tb5
							on tb1.outage_caused_id = tb5.outage_caused_id
							inner join
							sid.system_caused tb6
							on tb1.system_caused_id = tb6.system_caused_id
							inner join
							sid.tickets_pgs tb7
							on tb1.ticket_num = tb7.tickets_id
							inner join
							sid.pg tb8
							on tb7.pg_id = tb8.pg_id
							left outer join
							sid.addt_notes tb9
							on tb1.ticket_num = tb9.notes_id

							order by created_dt,ticket_num
					"""
				print 'qry ==', qry
				cursor.execute(qry)
				results = cursor.fetchall()
			else:
				cursor = connection.cursor()
				print 'prem-0'

				start_date_qry_set = False
				end_date_qry_set = False
				ticket_num_qry_set = False
				division_qry_set = False
				pg_qry_set = False

				start_date_qry = ''
				end_date_qry = ''
				ticket_num_qry = ''
				division_qry = ''
				pg_qry = ''

				if doc['start_date_s'] == '' and doc['start_date_e'] == '':
					pass
				else:
					start_date_qry_set = True
					start_date_s = datetime.datetime.strptime(doc['start_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					start_date_e = datetime.datetime.strptime(doc['start_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					start_date_qry = " created_dt between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)

				print 'prem-1'

				if doc['end_date_s'] == '' and doc['end_date_e'] == '':
					pass
				else:
					end_date_qry_set = True
					end_date_s = datetime.datetime.strptime(doc['end_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					end_date_e = datetime.datetime.strptime(doc['end_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					end_date_qry = " row_end_ts between '{end_date_s}' and '{end_date_e}' ".format(end_date_s=end_date_s,end_date_e=end_date_e)

				print 'prem-2'

				if doc['ticket_num'] == '':
					ticket_num_qry = ""
				else:
					ticket_num_qry_set = True
					ticket_num_qry = " ticket_num = '{ticket_num}' ".format(ticket_num=doc['ticket_num'])
				print 'prem-3'

				if doc['division'] == '':
					division_qry = ""
				else:
					division_qry_set = True
					division_qry = " tb2.division_name = '{division}' ".format(division=doc['division'])

				if doc['pg'] == '':
					pg_qry = ""
				else:
					pg_qry_set = True
					pg_cds = ['"' + each + '"' for each in doc['pg']]
					pg_cds = ' , '.join(pg_cds)
					pg_cds = pg_cds + ' ,"{0}"'.format('ALL')
					pg_qry = " tb8.pg_cd in ({pg_cds}) ".format(pg_cds=pg_cds)
					
				print 'prem-4 == ', doc['outage_caused']

				outage_qry = " tb5.outage_caused = '{outage_caused}' ".format(outage_caused=doc['outage_caused'])

				print 'prem-5'
				system_qry = " tb6.system_caused = '{system_caused}' ".format(system_caused=doc['system_caused'])

				order_qry = ' order by created_dt '
				print 'prem-6'


				
				
				qry = """
					select   tb1.ticket_num
							,tb1.created_dt
							,tb1.ticket_type
							,tb1.row_create_ts
							,tb1.row_end_ts
							,tb2.division_name
							,tb3.duration
							,tb4.error
							,tb5.outage_caused
							,tb6.system_caused
							,tb8.pg_cd
							,tb9.notes
							from sid.tickets tb1
							inner join
							sid.division tb2
							on tb1.division_id = tb2.division_id
							inner join
							sid.duration tb3
							on tb1.error_count_id = tb3.duration_id
							inner join
							sid.error_count tb4
							on tb1.error_count_id = tb4.error_count_id
							inner join
							sid.outage_caused tb5
							on tb1.outage_caused_id = tb5.outage_caused_id
							inner join
							sid.system_caused tb6
							on tb1.system_caused_id = tb6.system_caused_id
							inner join
							sid.tickets_pgs tb7
							on tb1.ticket_num = tb7.tickets_id
							inner join
							sid.pg tb8
							on tb7.pg_id = tb8.pg_id
							left outer join
							sid.addt_notes tb9
							on tb1.ticket_num = tb9.notes_id
					"""
				print 'start_date_qry == ', start_date_qry
				print 'end_date_qry == ', end_date_qry
				print 'ticket_num_qry == ', ticket_num_qry
				print 'division_qry == ', division_qry
				print 'outage_qry == ', outage_qry
				print 'system_qry == ', system_qry
				print 'pg_qry == ', pg_qry

				qry = qry + ' where ' 

				if start_date_qry_set:
					qry = qry + start_date_qry + ' and '

				if end_date_qry_set:
					qry = qry + end_date_qry + ' and '

				if division_qry_set:
					qry = qry + division_qry + ' and '

				if pg_qry_set:
					qry = qry + pg_qry + ' and '

				qry = qry + outage_qry  + ' and ' 
				qry = qry + system_qry 



					
				print 'qry == ', qry
				cursor.execute(qry)
				results = cursor.fetchall()
				#results = []
			
			print 'enumerate results == results', len(results)
			prev_ticket_num = ''
			pg_cd = []
			
			for counter, each in enumerate(results):
				curr_ticket_num = each[0]
				if counter == 0:
					prev_ticket_num = curr_ticket_num				
								
				if prev_ticket_num == curr_ticket_num:
					data['ticket_num'] = each[0]
					data['created_dt'] = each[1]
					data['division'] = each[5]
					pg_cd.append(each[10])
					data['duration'] = each[6]
					data['error_count'] = each[7]
					data['outage_caused'] = each[8]
					data['system_caused'] = each[9]
					
					if each[11] is None:
						data['addt_notes'] = ""
					else:
						data['addt_notes'] = each[11]
				else:
					if 'ALL' in pg_cd:
						pg_cd = ['ALL']
					data['pg'] = pg_cd

					output.append(data)
					#print 'else output == ', data
					data = {}
					pg_cd = []

					data['ticket_num'] = each[0]
					data['created_dt'] = each[1]
					data['division'] = each[5]
					pg_cd.append(each[10])
					data['duration'] = each[7]
					data['error_count'] = each[7]
					data['outage_caused'] = each[8]
					data['system_caused'] = each[9]
					if each[11] is None:
						data['addt_notes'] = ""
					else:
						data['addt_notes'] = each[11]


				prev_ticket_num = curr_ticket_num

			if len(results) > 0:	
				data['pg'] = pg_cd
				output.append(data)
				#print 'else output == ', data

				data = {}
				pg_cd = []			


		except Exception as e:
			print 'Select Exception == ', e
			logger.debug("MySQLException == {0}".format(e))
			JsonResponse({'status': 'failure'})

		#print 'output == ', output
		# print 'len-output == ', len(output)
		
		return JsonResponse({'results': output})


class UpdateTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(UpdateTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		print 'hi'
		alldata = request.POST
		print 'alldata ==', alldata
		print 'ticket_id ==', alldata.get('ticket_id')
		#created_dt = datetime.datetime.strptime(
		#	str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
		doc = {
			'division': alldata.get('division'),
			'pg': alldata.getlist('pg[]'),
			'error_count': alldata.get('error_count'),
			'ticket_num': alldata.get('ticket_num'),
			'outage_caused': alldata.get('outage_caused'),
			'system_caused': alldata.get('system_caused'),
			'ticket_type': alldata.get('ticket_type'),
			'duration': alldata.get('duration'),
		}
		print 'update doc  == ', doc
		try:
			with transaction.atomic():
				div,created = Division.objects.get_or_create(division_name=doc['division'])
				dur,created = Duration.objects.get_or_create(duration=doc['duration'])
				err,created = ErrorCount.objects.get_or_create(error=doc['error_count'])
				out,created = OutageCaused.objects.get_or_create(outage_caused=doc['outage_caused'])
				sys,created = SystemCaused.objects.get_or_create(system_caused=doc['system_caused'])
				ticket_info = {
				#	'created_dt': created_dt,
					'ticket_num': alldata.get('ticket_num'),
					'ticket_type': alldata.get('ticket_type'),
					'division': div.ID,
					'duration': dur.ID,
					'error_count': err.ID,
					'outage_caused': out.ID,
					'system_caused': sys.ID,
				}

				
				try:
					ticket,created = Tickets.objects.get_or_create(ticket_num=doc['ticket_num'])
				except Tickets.DoesNotExist:
					ticket = None

				# print 'done-1'
				# if ticket is None:
				# 	ticket = Tickets.objects.create(**ticket_info)
				# else:
				# 	print 'Ticket already present'
				# 	return JsonResponse({'status': 'Ticket already present'})
				
				for each in alldata.getlist('pg[]'):
					p,created = Pg.objects.get_or_create(pg_cd=each)
					ticket.pgs.add(p)
				print 'done-4'
				
		except Exception as e:
			print 'Exception == ', e 
			logger.debug("MySQLException == {0}".format(e))
			JsonResponse({'status': 'failure'})
		
		# try:
		# 	ticket = Tickets.objects.get(ID=alldata.get('ticket_id'))
		# 	print 'ticket == ', ticket
		# 	ticket.division = alldata.get('division')
		# 	ticket.pg = alldata.get('pg')
		# 	ticket.error_count = alldata.get('error_count')
		# 	ticket.outage_caused = alldata.get('outage_caused')
		# 	ticket.system_caused = alldata.get('system_caused')
		# 	ticket.addt_notes = alldata.get('addt_notes')
		# 	ticket.duration = alldata.get('duration')
		# 	ticket.save()
		# 	print 'ticket-saved'
		# except Exception as e:
		# 	print 'e = ', e
		# 	logger.debug("MySQLException == {0}".format(e))
		# 	JsonResponse({'status': 'failure'})

		return JsonResponse({'status': 'success'})
