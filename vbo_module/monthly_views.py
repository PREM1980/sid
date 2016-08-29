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

# class LoginView(View):
# 	@method_decorator(csrf_exempt)
# 	def dispatch(self, request, *args, **kwargs):
# 		return super(LoginView, self).dispatch(request, *args, **kwargs)

# 	def get(self, request):
# 		user_id = utils.check_session_variable(request)
# 		if user_id is None:
# 			return render(request,'tickets/loginpage.html',{'error':'N'})
# 		return render(request,'vbo_module/mainpage.html',{'error':'N'})

# 	def post(self, request):
# 		ip = utils.getip()
# 		username = request.POST['username']
# 		password = request.POST['password']

# 		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
# 		if result['status'] == 'success':
# 			request.session['userid'] = request.POST['username']
# 			return render(request,'vbo_module/mainpage.html',{'error':'N'})
# 		else:
# 			return render(request,'tickets/loginpage.html',{'error':'Y','msg':result['status']})

# class SplunkReportNames(View):

# 	@method_decorator(csrf_exempt)
# 	def dispatch(self, request, *args, **kwargs):
# 		return super(SplunkReportNames, self).dispatch(request, *args, **kwargs)

# 	def get(self, request):
# 		return JsonResponse({'status': 'success'})

# 	def post(self, request):		
# 		user_id = utils.check_session_variable(request)
		
# 		ip = utils.getip()
# 		alldata = request.POST
# 		api_key = request.META.get('HTTP_AUTHORIZATION')

# 		if user_id is not None or api_key == settings.API_KEY:			
# 			try:
# 				# results = requests.get('http://localhost:9000/get-report-names')
# 				results = requests.get(settings.VBO_SERVER + 'get-report-names')
# 				return JsonResponse({'status':'success', 'results':[results.json()]})
# 			except Exception as e:
# 				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
# 				return JsonResponse({'status': 'Contact Support Team'})

# 			return JsonResponse({'status': 'success'})
# 		else:
# 			return JsonResponse({'status': 'session timeout'})

# class ReportView(View):

# 	@method_decorator(csrf_exempt)
# 	def dispatch(self, request, *args, **kwargs):
# 		return super(ReportView, self).dispatch(request, *args, **kwargs)

# 	def get(self, request):
# 		user_id = utils.check_session_variable(request)
# 		if user_id is None:
# 			return render(request,'tickets/loginpage.html',{'error':'N'})
# 		return render(request,'vbo_module/reportpage.html',{'error':'N'})


class Report1(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report1, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			# print 'im here == ', request.GET.get('report_name')
			# print 'im here == ', request.GET.get('report_id')
			# print 'im here == ', request.GET.get('report_run_date')
			# print 'im in controller report-1 == ', settings.VBO_SERVER + '/monthly/report-1/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
			# 	 + '&report_id=' + request.GET.get('report_id')

			results = requests.get(settings.VBO_SERVER + '/monthly/report-1/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			print 'e == ', e
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})

class Report2(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report2, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-2/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})

class Report3(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report3, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-3/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})

class Report4(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report4, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-4/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})

class Report5(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report5, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-5/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})			

		
class Report6(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report6, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-6/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})		


class Report7(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report7, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-7/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})		

class Report8(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report8, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-8/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})		

class Report9(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report9, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-9/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})		


class Report10(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report10, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-10/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData-10 VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})		

class Report11(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report11, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-11/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData-11 VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})					

class Report12(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report12, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-12/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData-12 VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})								

class Report13(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report13, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-13/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData-12 VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})											


class Report14(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report14, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-14/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})					

class Report15(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report15, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-15/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})					

class Report16(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report16, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-16/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})					


class Report17(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report17, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-17/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})								


class Report19(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(Report19, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			results = requests.get(settings.VBO_SERVER + '/monthly/report-19/?' + 'report_name=' + request.GET.get('report_name') + '&report_run_date=' + request.GET.get('report_run_date') \
				 + '&report_id=' + request.GET.get('report_id'))			
			return JsonResponse({'status':'success', 'results':results.json()})
		except Exception as e:
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})								



class UpdateCallouts(View):

	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(UpdateCallouts, self).dispatch(request, *args, **kwargs)

	def get(self, request):
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

	

	