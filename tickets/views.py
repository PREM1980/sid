from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json
from elasticsearch import Elasticsearch, ElasticsearchException
from elasticsearch_dsl import Search
from elasticsearch_dsl import Search, Q
from django.core import serializers
# Create your views here.


class PostTicketData(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(PostTicketData, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        return JsonResponse({'status': 'success'})

    def post(self, request):
        alldata = request.POST

        doc = {
            'date': str(alldata.get('date')),
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
        print 'doc ==', doc
        es = Elasticsearch(['localhost'], verify_certs=True)
        try:
            es.index(index='tickets', doc_type='tickets', body=doc)
        except ElasticsearchException as es1:
            print 'es exception == ', es1
            return JsonResponse({'status': 'ElasticSearch failed!! Contact dev team!!'})

        return JsonResponse({'status': 'success'})


class GetTicketData(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super(GetTicketData, self).dispatch(request, *args, **kwargs)

    def get(self, request):
        print 'hello-get'
        return JsonResponse({'status': 'success'})

    def post(self, request):

        alldata = request.POST

        es = Elasticsearch(['localhost'], verify_certs=True)

        outage_caused = alldata.get('outage_caused')

        division = alldata.get('division')

        pg = alldata.get('pg')

        start_dt = alldata.get('start_date')

        end_dt = alldata.get('end_date')

        initial = alldata.get('initial')

        d = {'outage_caused.raw': outage_caused}

        if initial == 'Y':
            s = Search(using=es, index="tickets") \
                .filter("term", division=division) \
                .filter("term", pg=pg) \
                .filter("term", **d) \
                .filter("range", date={'gte': start_dt, 'lt': end_dt})
        else:
            s = Search(using=es, index="tickets") \
                .filter("range", date={'gte': start_dt, 'lt': end_dt})

        try:
            res = s.execute()
        except ElasticsearchException as es1:
            print 'es exception == ', es1
            return JsonResponse({'status': 'ElasticSearch failed!! Contact dev team!!'})

        data = []
        results = []

        for hit in s.scan():
            data.append(hit.date)
            data.append(hit.division)
            data.append(hit.pg)
            data.append(hit.duration)
            data.append(hit.error_count)
            data.append(hit.outage_caused)
            data.append(hit.system_caused)
            results.append(data)
            data = []

        return JsonResponse({'data': results})
