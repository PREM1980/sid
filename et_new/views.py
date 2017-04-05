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
		print 'im here ppe get'
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return utils.page_redirects_login(request)
		return render(request,'et_new/landing_page.html',{'error':'N'})

	def post(self, request):
		ip = utils.getip()
		username = request.POST['username']
		password = request.POST['password']

		result = utils.check_user_auth(request.POST['username'],request.POST['password'])
		if result['status'] == 'success':
			request.session['userid'] = request.POST['username']
			return render(request,'et_new/landing_page.html',{'error':'N'})
		else:
			return utils.page_redirects_login(request,user_id)

class CempVsSplunk(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, request, *args, **kwargs):
		return super(CempVsSplunk, self).dispatch(request, *args, **kwargs)

	def get(self, request):
		
		user_id = utils.check_session_variable(request)
		if user_id is None:
			return utils.page_redirects_login(request)
		return render(request,'et_new/cemp_vs_splunk.html',{'error':'N'})

	