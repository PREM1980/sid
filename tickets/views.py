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
from models import Tickets
import datetime
from uuid import UUID
import uuid
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
        created_dt = datetime.datetime.strptime(
            str(alldata.get('date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
        doc = {
            'created_dt': created_dt,
            'division': str(alldata.get('division')),
            'pg': str(alldata.get('pg')),
            'error_count': str(alldata.get('error_count')),
            'ticket_num': str(alldata.get('ticket_num')),
            'outage_caused': str(alldata.get('outage_caused')),
            'system_caused': str(alldata.get('system_caused')),
            'addt_notes': str(alldata.get('addt_notes')),
            'ticket_type': str(alldata.get('ticket_type')),
            'duration': str(alldata.get('duration'))
        }
        print 'doc1 ==', doc
        logger.debug("Insert document == {0}".format(doc))

        try:
            Tickets.objects.create(**doc)
        except Exception as e:
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
        addt_notes = alldata.get('addt_notes')
        print 'outage_caused == ', outage_caused
        print 'system_caused == ', system_caused

        data = {}
        results = []

        try:
            if initial == 'N':
                start_date = datetime.datetime.strptime(
                str(alldata.get('start_date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')
                
                end_date = datetime.datetime.strptime(
                    str(alldata.get('end_date')), '%Y/%m/%d %H:%S').strftime('%Y-%m-%d %H:%S:00')

                if system_caused =='All' and outage_caused == 'All':
                    filters = {
                        'created_dt__range':[start_date,end_date],
                        'division':division,
                        'pg':pg,
                        #'system_caused':system_caused,
                        #'outage_caused':outage_caused,
                        'addt_notes':addt_notes
                    }
                else:
                    filters = {
                        'created_dt__range':[start_date,end_date],
                        'division':division,
                        'pg':pg,
                        'addt_notes':addt_notes
                    }

                print 'filters == ', filters
                
                for each in Tickets.objects.filter(**filters)[:100]:
                    data['ticket_id'] = each.ID
                    data['created_dt'] = each.created_dt
                    data['ticket_num'] = each.ticket_num
                    data['division'] = each.division
                    data['pg'] = each.pg
                    data['duration'] = each.duration
                    data['error_count'] = each.error_count
                    data['outage_caused'] = each.outage_caused
                    data['system_caused'] = each.system_caused
                    data['addt_notes'] = each.addt_notes
                    results.append(data)
                    data = {}
                        
            else:
                for each in Tickets.objects.order_by('created_dt')[:100]:
                    data['ticket_id'] = each.ID
                    data['created_dt'] = each.created_dt
                    data['ticket_num'] = each.ticket_num
                    data['division'] = each.division
                    data['pg'] = each.pg
                    data['duration'] = each.duration
                    data['error_count'] = each.error_count
                    data['outage_caused'] = each.outage_caused
                    data['system_caused'] = each.system_caused
                    data['addt_notes'] = each.addt_notes
                    results.append(data)
                    data = {}

        except Exception as e:
            print 'Select Exception == ', e
            logger.debug("MySQLException == {0}".format(e))
            JsonResponse({'status': 'failure'})

        print 'results == ', results
        print 'len-results == ', len(results)
        
        return JsonResponse({'results': results})


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
        print 'ticket_id ==', str(alldata.get('ticket_id'))
        
        try:
            ticket = Tickets.objects.get(ID=alldata.get('ticket_id'))
            print 'ticket == ', ticket
            ticket.division = alldata.get('division')
            ticket.pg = alldata.get('pg')
            ticket.error_count = alldata.get('error_count')
            ticket.outage_caused = alldata.get('outage_caused')
            ticket.system_caused = alldata.get('system_caused')
            ticket.addt_notes = alldata.get('addt_notes')
            ticket.duration = alldata.get('duration')
            ticket.save()
            print 'ticket-saved'
        except Exception as e:
            print 'e = ', e
            logger.debug("MySQLException == {0}".format(e))
            JsonResponse({'status': 'failure'})

        return JsonResponse({'status': 'success'})
