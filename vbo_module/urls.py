from django.conf.urls import include, url
from django.contrib import admin
from vbo_module.views import LoginView,SplunkReportNames
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    #url(r'^$', TemplateView.as_view(template_name="vbo_module/mainpage.html")),        
    url(r'^login$', LoginView.as_view()),
    url(r'^get-report-names$', SplunkReportNames.as_view()),
]
