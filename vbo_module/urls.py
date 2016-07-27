from django.conf.urls import include, url
from django.contrib import admin
from vbo_module.views import LoginView , SplunkReportNames, ReportView, ReportData, UpdateCallouts
from vbo_module.monthly_views import Report1, Report2, Report3, Report4, Report5, Report6
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #url(r'^$', TemplateView.as_view(template_name="vbo_module/mainpage.html")),        
    url(r'^main$', LoginView.as_view()),
    url(r'^report-view$', ReportView.as_view()),
    url(r'^report-data/$', ReportData.as_view()),
    url(r'^get-report-names$', SplunkReportNames.as_view()),
    url(r'^update-report-callouts/$', UpdateCallouts.as_view()),
    #Monthly
    # url(r'^monthly/report-view$', ReportView.as_view()),
    url(r'^monthly/report-1/$', Report1.as_view()),
    url(r'^monthly/report-2/$', Report2.as_view()),
    url(r'^monthly/report-3/$', Report3.as_view()),
    url(r'^monthly/report-4/$', Report4.as_view()),
    url(r'^monthly/report-5/$', Report5.as_view()),
    url(r'^monthly/report-6/$', Report6.as_view()),
    # url(r'^get-report-names$', SplunkReportNames.as_view()),
    # url(r'^update-report-callouts/$', UpdateCallouts.as_view())    
]

