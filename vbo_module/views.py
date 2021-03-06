from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils import six
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
			return utils.page_redirects_login(request)
		return render(request,'vbo_module/vbo_landing_page.html',{'error':'N','hide':utils.hide_sid_create_section(),'admin_user':utils.check_if_admin(user_id)})

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'vbo_module/vbo_landing_page.html',{'error':'N'})
		else:
			return utils.page_redirects_login(request,user_id)

class SplunkReportNames(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(SplunkReportNames, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		return JsonResponse({'status': 'success'})

	def post(self, request):		
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:			
			try:
				# results = requests.get('http://localhost:9000/get-report-names')
				results = requests.get(settings.VBO_SERVER + 'get-report-names')
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
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
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			report_name= request.GET.get('report_name')
			report_run_date = request.GET.get('report_run_date')			
			results = requests.get(settings.VBO_SERVER + 'get-nbrf-data/?' + 'report_name=' + report_name + '&report_run_date='+report_run_date )			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})
		

	def post(self, request):		
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:			
			try:
				# results = requests.get('http://localhost:9000/get-report-names')
				results = requests.get(settings.VBO_SERVER + 'get-nbrf-data')
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'Exception == ', e 
				logger.debug("ReportData VBO-Module == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})


class UpdateComments(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(UpdateComments, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		print 'Update comments'
		user_id = utils.check_session_variable(request)
		
		ip = utils.getip()
		alldata = request.POST
		api_key = request.META.get('HTTP_AUTHORIZATION')

		if user_id is not None or api_key == settings.API_KEY:			
			try:
				print 'settings.VBO_SERVER == ', settings.VBO_SERVER
				results = requests.get(settings.VBO_SERVER + 'update-callouts/?' + '&report_num=' + request.GET.get('report_num') \
					+ '&report_name=' + request.GET.get('report_name') + '&report_run_date='+ request.GET.get('report_run_date') \
					 + '&report_callouts='+ request.GET.get('report_callouts')	)		
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'update callouts == ', e
				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})

	

class StoreCallouts(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(StoreCallouts, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		print 'get user id == ', user_id
		print 'get report id == ', request.GET.get('report_id')
		if user_id is not None or api_key == settings.API_KEY:			
			print 'calling vbo get'
			try:				
				results = requests.get(settings.VBO_SERVER + 'store-callouts/?' + 'report_id=' + request.GET.get('report_id')   )
				print 'results.json == ', results.json()
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'update callouts == ', e
				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})
		return JsonResponse({'status': 'success'})	

	def post(self, request):
		user_id = utils.check_session_variable(request)		
		# print ' report_num == ', request.GET.get('report_callouts')
		ip = utils.getip()
		alldata = request.body				
		print 'alldata == ', alldata
		try:
			print 'alldata == ', json.loads(request.body)
		except Exception as e:
			print 'e == ', e
		# payload = dict(six.iterlists(json.loads(request.body)))
		# payload = json.dumps(json.loads(request.body))				
		# alldata = request.POST
		payload = request.body
				
		# payload = dict(six.iterlists(request.POST))		
		if user_id is not None or api_key == settings.API_KEY:			
			try:				
				results = requests.post(settings.VBO_SERVER + 'store-callouts/?' + '&report_num=' + request.GET.get('report_num') \
					+ '&report_id=' + request.GET.get('report_id')  + '&report_run_date='+ request.GET.get('report_run_date'), data=payload )
				# print 'results.json == ', results.json()
				print 'results.json == ', results.json()
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:
				print 'update callouts == ', e
				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})


class GetSessionCounts(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(GetSessionCounts, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		user_id = utils.check_session_variable(request)
		print 'user id == ', user_id
		api_key = request.META.get('HTTP_AUTHORIZATION')
		if user_id is not None or api_key == settings.API_KEY:			
			print 'calling vbo get'
			try:				
				results = requests.get(settings.VBO_SERVER + 'get-session-counts' )
				# print 'results.json == ', results.json()
				return JsonResponse({'status':'success', 'results':[results.json()]})
			except Exception as e:				
				logger.debug("GetSessionCounts Exception == {0}".format(e))
				return JsonResponse({'status': 'Contact Support Team'})

			return JsonResponse({'status': 'success'})
		else:
			return JsonResponse({'status': 'session timeout'})
		return JsonResponse({'status': 'success'})	
	

		
