from django.conf.urls import include, url
from django.contrib import admin
from qvfb.views import LoginView,VBFCombined
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #url(r'^$', TemplateView.as_view(template_name="vbo_module/mainpage.html")),        
    url(r'^main$', LoginView.as_view()),
    url(r'^qvfb$', VBFCombined.as_view()),
    # url(r'^report-view$', ReportView.as_view()),
    # url(r'^report-data/$', ReportData.as_view()),
    # url(r'^get-report-names$', SplunkReportNames.as_view()),
    # url(r'^update-report-callouts/$', UpdateCallouts.as_view()),
]

