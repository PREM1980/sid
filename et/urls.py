from django.conf.urls import include, url
from django.contrib import admin
from et.views import LoginView 
# from vbo_module.monthly_views import Report1, Report2, Report3, Report4, Report5, Report6, Report14, Report15, Report16
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

print 'im herer'
urlpatterns = [
    #url(r'^$', TemplateView.as_view(template_name="vbo_module/mainpage.html")),        
    url(r'^main$', LoginView.as_view()),
    # url(r'^main$', LoginView.as_view()),
    # url(r'^report-view$', ReportView.as_view()),
    # url(r'^report-data/$', ReportData.as_view()),
    # url(r'^get-report-names$', SplunkReportNames.as_view()),
    # url(r'^update-report-callouts/$', UpdateCallouts.as_view()),
]

