from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from elasticsearch import Elasticsearch, ElasticsearchException
from elasticsearch_dsl import Search
from elasticsearch_dsl import Search, Q
from django.core import serializers
from django.db import transaction
from uuid import UUID
from django.db import connection
from django.conf import settings
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from xlsxwriter.workbook import Workbook
import requests

import logging
import socket
import uuid
import datetime
import json
from django.conf import settings

logger = logging.getLogger('app_logger')

logger_feedback = logging.getLogger('feedback_logger')

from tickets import utils
from pytz import timezone

class LoginView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(LoginView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		return render(request,'vbo_module/mainpage.html',{'error':'N'})

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'vbo_module/mainpage.html',{'error':'N'})
		else:
			return render(request,'tickets/loginpage.html',{'error':'Y','msg':result['status']})

class SplunkReportNames(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(SplunkReportNames, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):
		print 'called'
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:			
			try:
				
				# results = requests.get('http://localhost:9000/get-report-names')
				results = requests.get(settings.VBO_SERVER + 'get-report-names')
				print 'response from splunk vcp == ', results.json()
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'Exception == ', e 
				logger.debug("MySQLException == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})

class ReportView(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ReportView, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		return render(request,'vbo_module/reportpage.html',{'error':'N'})


class ReportData(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ReportData, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		print 'charts datauserid ==', userid
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			
			report_name= request.GET.get('report_name')
			report_run_date = request.GET.get('report_run_date')
			print 'report_run_date == ', report_run_date
			# results = requests.get('http://localhost:9000/get-report-names')
			results = requests.get(settings.VBO_SERVER + 'get-nbrf-data/?' + 'report_name=' + report_name + '&report_run_date='+report_run_date )
			print 'response from splunk vcp == ', results
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			print 'Exception == ', e 
			logger.debug("MySQLException == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})
		

	def post(self, request):
		print 'called'
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:			
			try:
				# results = requests.get('http://localhost:9000/get-report-names')
				results = requests.get(settings.VBO_SERVER + 'get-nbrf-data')
				print 'response from splunk vcp == ', results.json()
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'Exception == ', e 
				logger.debug("MySQLException == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})
	