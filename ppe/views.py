from django.shortcuts import render, render_to_response, HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.core import serializers
from django.db import transaction
from uuid import UUID
from django.db import connection
from django.conf import settings
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
		return render(request,'ppe/mainpage.html',{'error':'N'})

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'ppe/mainpage.html',{'error':'N'})
		else:
			return render(request,'tickets/loginpage.html',{'error':'Y','msg':result['status']})

class PullPPE(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(PullPPE, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		print 'pullPPE'
		# return JsonResponse({'status': 'success'})
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:
			print 'pull PPE settings.PPE_SERVER == ', settings.PPE_SERVER
			startdate= request.GET.get('startdate')
			enddate = request.GET.get('enddate')			
			metric = request.GET.get('metric')			
			rtype = request.GET.get('rtype')			
			stb = request.GET.get('stb')			
			call_server =  'pullppe?' + 'startdate=' + startdate + '&enddate='+enddate + '&rtype='+rtype + '&stb='+stb +'&metric='+metric
			print 'call_server ==', call_server
			results = requests.get(settings.PPE_SERVER + call_server)			
			print 'results ==', results.text
			return JsonResponse({'status':'success', 'results':json.loads(results.text)})
		except Exception as e:
			print 'Exception == ', e
			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})



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


# class ReportData(View):

# 	@method_decorator(csrf_exempt)
# 	def dispatch(self, request, *args, **kwargs):
# 		return super(ReportData, self).dispatch(request, *args, **kwargs)

# 	def get(self, request):

# 		userid = utils.check_session_variable(request)
		
# 		if userid is None:
# 			return render(request,'tickets/loginpage.html',{'error':'N'})
# 		try:
# 			report_name= request.GET.get('report_name')
# 			report_run_date = request.GET.get('report_run_date')			
# 			results = requests.get(settings.VBO_SERVER + 'get-nbrf-data/?' + 'report_name=' + report_name + '&report_run_date='+report_run_date )			
# 			return JsonResponse({'status':'success', 'results':results.json()})
# 		except Exception as e:
# 			logger.debug("ReportData VBO-Module Exception == {0}".format(e))
# 			return JsonResponse({'status': 'Contact Support Team'})
		

# 	def post(self, request):		
# 		user_id = utils.check_session_variable(request)
		
# 		ip = utils.getip()
# 		alldata = request.POST
# 		api_key = request.META.get('HTTP_AUTHORIZATION')

# 		if user_id is not None or api_key == settings.API_KEY:			
# 			try:
# 				# results = requests.get('http://localhost:9000/get-report-names')
# 				results = requests.get(settings.VBO_SERVER + 'get-nbrf-data')
# 				return JsonResponse({'status':'success', 'results':[results.json()]})
# 			except Exception as e:
# 				print 'Exception == ', e 
# 				logger.debug("ReportData VBO-Module == {0}".format(e))
# 				return JsonResponse({'status': 'Contact Support Team'})

# 			return JsonResponse({'status': 'success'})
# 		else:
# 			return JsonResponse({'status': 'session timeout'})


# class UpdateCallouts(View):

# 	@method_decorator(csrf_exempt)
# 	def dispatch(self, request, *args, **kwargs):
# 		return super(UpdateCallouts, self).dispatch(request, *args, **kwargs)

# 	def get(self, request):
# 		user_id = utils.check_session_variable(request)
		
# 		ip = utils.getip()
# 		alldata = request.POST
# 		api_key = request.META.get('HTTP_AUTHORIZATION')

# 		if user_id is not None or api_key == settings.API_KEY:			
# 			try:
# 				print 'settings.VBO_SERVER == ', settings.VBO_SERVER
# 				results = requests.get(settings.VBO_SERVER + 'update-callouts/?' + '&report_num=' + request.GET.get('report_num') \
# 					+ '&report_name=' + request.GET.get('report_name') + '&report_run_date='+ request.GET.get('report_run_date') \
# 					 + '&report_callouts='+ request.GET.get('report_callouts')	)		
# 				return JsonResponse({'status':'success', 'results':[results.json()]})
# 			except Exception as e:
# 				print 'update callouts == ', e
# 				logger.debug("ReportData VBO-Module Exception == {0}".format(e))
# 				return JsonResponse({'status': 'Contact Support Team'})

# 			return JsonResponse({'status': 'success'})
# 		else:
# 			return JsonResponse({'status': 'session timeout'})

	

# 	