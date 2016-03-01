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
from models import Tickets, Division, Duration, Pg, ErrorCount, OutageCaused, SystemCaused
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
		print 'pg == ', alldata.getlist('pg[]')
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
		print 'doc2 ==', doc
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

				print 'done-0  == ', doc['ticket_num']
				try:
					ticket = Tickets.objects.get(ticket_num=doc['ticket_num'])
				except Tickets.DoesNotExist:
					ticket = None

				print 'done-1'
				if ticket is None:
					ticket = Tickets.objects.create(**ticket_info)
				else:
					print 'Ticket already present'
					return JsonResponse({'status': 'Ticket already present'})
				
				for each in alldata.getlist('pg[]'):
					p,created = Pg.objects.get_or_create(pg_cd=each)
					ticket.pgs.add(p)
				print 'done-4'
				
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
		print 'alldata == ', alldata
		outage_caused = alldata.get('outage_caused')
		division = alldata.get('division')
		pg = alldata.get('pg')
		start_dt = alldata.get('start_date')
		end_dt = alldata.get('end_date')
		initial = alldata.get('initial')
		system_caused = alldata.get('system_caused')
		#addt_notes = alldata.get('addt_notes')
		
		doc = {
			'division': alldata.get('division'),
			'pg': alldata.getlist('pg[]'),
			'error_count': alldata.get('error_count'),
			'ticket_num': alldata.get('ticket_num'),
			'outage_caused': alldata.get('outage_caused'),
			'system_caused': alldata.get('system_caused'),
			'ticket_type': alldata.get('ticket_type'),
			'duration': alldata.get('duration'),
			'start_dt': alldata.get('start_date'),
			'end_dt': alldata.get('end_date')
		}

		data = {}
		output = []
		print 'initial == ', initial
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
							order by created_dt,ticket_num
					"""
				print 'qry ==', qry
				cursor.execute(qry)
				results = cursor.fetchall()
			else:
				cursor = connection.cursor()
				print 'prem-0'
				if doc['ticket_num'] is None:
					ticket_num_qry = ""
				else:
					ticket_num_qry = " ticket_num = '{ticket_num}' ".format(ticket_num=doc['ticket_num'])
				print 'prem-1'
				if doc['division'] is None:
					division_qry = " tb2.division_name = '{division}' ".format(division=doc['division'])
				else:
					division_qry = ""

				print 'prem-2 == ', doc['outage_caused']

				outage_qry = " tb5.outage_caused = '{outage_caused}' ".format(outage_caused=doc['outage_caused'])

				print 'prem-3'
				system_qry = " tb6.system_caused = '{system_caused}' ".format(system_caused=doc['system_caused'])

				order_qry = ' order by created_dt '
				print 'prem-5'
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
							
							
					""".format(ticket_num=doc['ticket_num'],division=doc['division'],
						outage_caused=doc['outage_caused'],system_caused=doc['system_caused'])
				
				qry = qry + ' where ' \
				 	+ ticket_num_qry + ' and ' \
					+ division_qry + ' and ' \
					+ outage_qry  + ' and ' \
					+ system_qry \
					+ order_qry  
				#print 'qry == ', qry
				#cursor.execute(qry)
				#results = cursor.fetchall()
				#results = []
			
			print 'enumerate results == results', len(results)
			prev_ticket_num = ''
			pg_cd = []
			
			for counter, each in enumerate(results):
				print 'each == ', each
				print 'counter == ', counter
				curr_ticket_num = each[0]
				if counter == 0:
					prev_ticket_num = curr_ticket_num
					print 'first loop'
				
				# print 'prev_ticket_num == ', prev_ticket_num
				# print 'data-ticket-num == ', curr_ticket_num
				
				if prev_ticket_num == curr_ticket_num:
					data['ticket_num'] = each[0]
					data['created_dt'] = each[1]
					data['division'] = each[5]
					pg_cd.append(each[10])
					data['duration'] = each[6]
					data['error_count'] = each[7]
					data['outage_caused'] = each[8]
					data['system_caused'] = each[9]
					data['addt_notes'] = each[9]
				else:
					data['pg'] = pg_cd
					output.append(data)
					print 'else output == ', data

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
					data['addt_notes'] = each[9]


				prev_ticket_num = curr_ticket_num
			data['pg'] = pg_cd
			output.append(data)
			print 'else output == ', data

			data = {}
			pg_cd = []			


		except Exception as e:
			print 'Select Exception == ', e
			logger.debug("MySQLException == {0}".format(e))
			JsonResponse({'status': 'failure'})

		print 'output == ', output
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
