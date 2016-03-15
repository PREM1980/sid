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
import queries

print queries.all_query['generic']


class PostTicketData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PostTicketData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		alldata = request.POST
		print 'post alldata == ', alldata
		
		logger.debug("post data  == {0}".format(alldata))

		created_dt = datetime.datetime.strptime(
			str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
		
		t = Ticket(created_dt
			,alldata.get('division')
			,alldata.getlist('pg[]')
			,alldata.get('error_count')
			,alldata.get('ticket_num')
			,alldata.get('outage_caused')
			,alldata.get('system_caused')
			,alldata.get('addt_notes')
			,alldata.get('ticket_type')
			,alldata.get('duration'))
		
		logger.debug("Insert document == {0}".format(t))
		
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
				}

				try:
					ticket = Tickets.objects.get(ticket_num=t.ticket_num)
				except Tickets.DoesNotExist:
					ticket = None

				if ticket is None:
					ticket = Tickets.objects.create(**ticket_info)
				else:
					print 'Ticket already present'
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

		print 'doc == ', doc
		try:
			if initial == 'Y':
				cursor = connection.cursor()
				print 'prem-set'
				print 'qry ==', queries.all_query['generic']
				cursor.execute(queries.all_query['generic'])
				results = cursor.fetchall()
			else:
				cursor = connection.cursor()
				print 'prem-0'

				start_date_qry_set = end_date_qry_set = ticket_num_qry_set = division_qry_set = pg_qry_set = outage_qry_set = system_qry_set = False
				start_date_qry = end_date_qry = ticket_num_qry = division_qry = pg_qry = outage_qry = system_qry = ''
				
				if doc['start_date_s'] == '' and doc['start_date_e'] == '':
					pass
				else:
					start_date_qry_set = True
					start_date_s = datetime.datetime.strptime(doc['start_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					start_date_e = datetime.datetime.strptime(doc['start_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
					start_date_qry = " tb1.row_create_ts between '{start_date_s}' and '{start_date_e}' ".format(start_date_s=start_date_s,start_date_e=start_date_e)


				if doc['end_date_s'] == '' and doc['end_date_e'] == '':
					pass
				else:
					end_date_qry_set = True
					end_date_s = datetime.datetime.strptime(doc['end_date_s'], '%m/%d/%Y').strftime('%Y-%m-%d 00:00:00')
					end_date_e = datetime.datetime.strptime(doc['end_date_e'], '%m/%d/%Y').strftime('%Y-%m-%d 23:59:59')
					end_date_qry = " tb1.row_end_ts between '{end_date_s}' and '{end_date_e}' ".format(end_date_s=end_date_s,end_date_e=end_date_e)

				if doc['ticket_num'] == '':
					ticket_num_qry = ""
				else:
					ticket_num_qry_set = True
					ticket_num_qry = " tb1.ticket_num = '{ticket_num}' ".format(ticket_num=doc['ticket_num'])

				if doc['division'] in ['','Division','All']:
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

					tkts = ['"' + each + '"' for each in elig_tkts]
					tkts = ' , '.join(tkts)
					tkt_qry = " where tb1.ticket_num in ({tkts}) ".format(tkts=tkts)

					pg_qry = queries.all_query['pg_conditions']
					pg_qry = pg_qry + tkt_qry 
					pg_qry = pg_qry + ' ORDER BY tb1.row_create_ts desc, tb1.ticket_num desc'
					print 'tkt_qry == ', pg_qry
					cursor.execute(pg_qry)
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
					prev_qry_set = False

					if start_date_qry_set or end_date_qry_set or division_qry_set or pg_qry_set or outage_qry_set or system_qry_set or ticket_num_qry_set:
					 	qry = qry + ' where ' 

					if start_date_qry_set:
						qry = qry + start_date_qry
						prev_qry_set = True 

					if end_date_qry_set:
						if prev_qry_set:
							qry = qry + ' and ' + end_date_qry 
							prev_qry_set = True
						else:
							qry = qry + end_date_qry
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
							
					if pg_qry_set:
						if prev_qry_set:
							qry = qry + ' and ' + pg_qry 
							prev_qry_set = True
						else:
							qry = qry + pg_qry
							prev_qry_set = True

					if outage_qry_set:
						if prev_qry_set:
							qry = qry + ' and ' + outage_qry  
							prev_qry_set = True
						else:
							qry = qry + outage_qry  
							prev_qry_set = True

					if system_qry_set:
						if prev_qry_set:
							qry = qry + ' and ' + system_qry 
						else:
							qry = qry + system_qry  
					qry = qry + ' ORDER BY tb1.row_create_ts desc, tb1.ticket_num desc'
					print 'qry == ', qry
					cursor.execute(qry)
					results = cursor.fetchall()
					#results = []
				
			print 'enumerate results == results', len(results)
			output = enum_results(results)
			
		except Exception as e:
			print 'Select Exception == ', e
			logger.debug("MySQLException == {0}".format(e))
			return JsonResponse({'status': 'failure'})

		print 'output == ', output
		# print 'len-output == ', len(output)
		
		return JsonResponse({'results': output})


def enum_results(results):
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
			data['ticket_type'] = each[2]
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
			data['ticket_type'] = each[2]
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

			#Limit the number of rows displayed to 100.
			if len(output) > 100:
				break


		prev_ticket_num = curr_ticket_num

	if len(results) > 0:	
		data['pg'] = pg_cd
		output.append(data)
		#print 'else output == ', data

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
		print 'hi'
		alldata = request.POST
		print 'Update alldata ==', alldata
		
		if alldata.get('update') == 'Y':
		   ticket_num =  alldata.get('ticket_num')
		   ticket = Tickets.objects.get(ticket_num=ticket_num)
		   ticket.row_end_ts = datetime.datetime.now()
		   ticket.save()
		   return JsonResponse({'status': 'success'})

		t = Ticket(""
			,alldata.get('division')
			,alldata.getlist('pg[]')
			,alldata.get('error_count')
			,alldata.get('ticket_num')
			,alldata.get('outage_caused')
			,alldata.get('system_caused')
			,alldata.get('addt_notes')
			,alldata.get('ticket_type')
			,alldata.get('duration'))
		
		print 'update doc  == ', t
		logger.debug("Update document == {0}".format(t))
		
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

class Ticket(object):
	def __init__(self, created_dt, division, pg, error_count, ticket_num, outage_caused, system_caused, addt_notes, ticket_type, duration):
		self.created_dt = created_dt
		self.division = division 
		self.pg = pg
		self.error_count = error_count
		self.ticket_num = ticket_num
		self.outage_caused = outage_caused
		self.system_caused = system_caused
		self.addt_notes = addt_notes
		self.ticket_type = ticket_type
		self.duration = duration		

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


