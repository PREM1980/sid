from django.conf.urls import include, url
from django.contrib import admin
from vbo_module.views import LoginView , SplunkReportNames, ReportView, ReportData, UpdateComments, StoreCallouts, GetSessionCounts
from vbo_module.monthly_views import Report1, Report2, Report3, Report4, Report5, Report6, Report7, Report8, Report9, Report10, Report11, Report12, Report13, Report14, Report15, Report16, Report17, Report19 
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #url(r'^$', TemplateView.as_view(template_name="vbo_module/mainpage.html")),        
    url(r'^main$', LoginView.as_view()),
    url(r'^report-view$', ReportView.as_view()),
    url(r'^report-data/$', ReportData.as_view()),
    url(r'^get-report-names$', SplunkReportNames.as_view()),
    url(r'^update-report-comments/$', UpdateComments.as_view()),
    url(r'^store-callouts/$', StoreCallouts.as_view()),
    url(r'^get-session-counts$', GetSessionCounts.as_view()),
    #Monthly
    # url(r'^monthly/report-view$', ReportView.as_view()),
    url(r'^monthly/report-1/$', Report1.as_view()),
    url(r'^monthly/report-2/$', Report2.as_view()),
    url(r'^monthly/report-3/$', Report3.as_view()),
    url(r'^monthly/report-4/$', Report4.as_view()),
    url(r'^monthly/report-5/$', Report5.as_view()),
    url(r'^monthly/report-6/$', Report6.as_view()),
    url(r'^monthly/report-7/$', Report7.as_view()),
    url(r'^monthly/report-8/$', Report8.as_view()),
    url(r'^monthly/report-9/$', Report9.as_view()),
    url(r'^monthly/report-10/$', Report10.as_view()),
    url(r'^monthly/report-11/$', Report11.as_view()),
    url(r'^monthly/report-12/$', Report12.as_view()),
    url(r'^monthly/report-13/$', Report13.as_view()),
    url(r'^monthly/report-14/$', Report14.as_view()),
    url(r'^monthly/report-15/$', Report15.as_view()),
    url(r'^monthly/report-16/$', Report16.as_view()),
    url(r'^monthly/report-17/$', Report17.as_view()),
    url(r'^monthly/report-19/$', Report19.as_view()),
    # url(r'^get-report-names$', SplunkReportNames.as_view()),
    # url(r'^update-report-callouts/$', UpdateCallouts.as_view())    
]

