from django.conf.urls import include, url
from django.contrib import admin
from tickets.views import ChartsData,ChartsView,NinjaUsersData,PostTicketData, GetTicketData,UpdateTicketData,RecordFeedBack, LoginView,ExcelDownload, PDFDownload
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', TemplateView.as_view(template_name="tickets/loginpage.html")),
    url(r'^login$', LoginView.as_view()),
    url(r'^get-ticket-data$', GetTicketData.as_view(), name="get_ticket_data"),
    #Get all charts for SID
    url(r'^charts$', ChartsView.as_view()),    
    url(r'^charts-data$', ChartsData.as_view()),    

    url(r'^send_feedback_clean$', RecordFeedBack.as_view()),
    #Report Downloads
    url(r'^xls-download-data$', ExcelDownload.as_view()),
    url(r'^pdf-download-data$', PDFDownload.as_view()),
    url(r'^api_docs$', TemplateView.as_view(template_name="tickets/apipage.html")),


    #Get all the Ninja Users and their division.
    url(r'^get-ninja-users$', NinjaUsersData.as_view(), name="update_ticket_data"),    
    url(r'^post-ticket-data$', PostTicketData.as_view()),
    url(r'^update-ticket-data$', UpdateTicketData.as_view(), name="update_ticket_data"),

    #Urls for VBO Modules

    url(r'^vbo/',include('vbo_module.urls'))
    
]

