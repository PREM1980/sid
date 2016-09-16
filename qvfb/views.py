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
		print 'im here '
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return utils.page_redirects_login(request)
		return render(request,'qvfb/qvfb_landing_page.html',{'error':'N'})

	def post(self, request):
		print 'im here '
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'qvfb/qvfb_landing_page.html',{'error':'N'})
		else:
			return utils.page_redirects_login(request,user_id)

class ETStats(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(ETStats, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		print 'ETStats'
		# return JsonResponse({'status': 'success'})
		userid = utils.check_session_variable(request)
		
		if userid is None:
			return render(request,'tickets/loginpage.html',{'error':'N'})
		try:            
			rtype = request.GET.get('rtype')
			month = request.GET.get('month')            
			no_requested = request.GET.get('no_requested')                      
			no_errors_requested=request.GET.get('no_errors_requested')
			call_server = 'etstats?' + 'rtype=' + rtype + '&month='+month + '&no_requested='+no_requested + '&no_errors_requested='+no_errors_requested         
			results = requests.get(settings.ET_SERVER + call_server)            
			print 'results == ', results.text
			return JsonResponse({'status':'success', 'results':json.loads(results.text)})
		except Exception as e:
			print 'Exception == ', e
			logger.debug("ETStats  Exception == {0}".format(e))
			return JsonResponse({'status': 'Contact Support Team'})

class ETTrending(View):
		@method_decorator(csrf_exempt)
		def dispatch(self, request, *args, **kwargs):
				return super(ETTrending, self).dispatch(request, *args, **kwargs)

		def get(self, request):
				print 'ETStats'
				# return JsonResponse({'status': 'success'})
				userid = utils.check_session_variable(request)

				if userid is None:
						return render(request,'tickets/loginpage.html',{'error':'N'})
				try:
						print 'pull ET settings.ET_SERVER == ', settings.ET_SERVER
						trending_rtype = request.GET.get('trending_rtype')
						trending_month = request.GET.get('trending_month')    
						months_requested = request.GET.get('months_requested')
						print 'settings.ET_SERVER-1 == ', settings.ET_SERVER
						call_server = 'ettrending?' + 'trending_rtype=' + trending_rtype + '&trending_month='+trending_month + '&months_requested='+months_requested
						print 'call_server == ', call_server
						results = requests.get(settings.ET_SERVER + call_server)              
						print 'results-1 == ', results.text
						return JsonResponse({'status':'success', 'results':json.loads(results.text)})
				except Exception as e:
						print 'Exception == ', e
						logger.debug("ETTrending  Exception == {0}".format(e))
						return JsonResponse({'status': 'Contact Support Team'})

