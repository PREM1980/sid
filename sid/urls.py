from django.conf.urls import include, url
from django.contrib import admin
from tickets.views import PostTicketData, GetTicketData
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Examples:
    # url(r'^$', 'sid.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', TemplateView.as_view(template_name="tickets/mainpage.html")),
    url(r'^post-ticket-data$', PostTicketData.as_view()),
    url(r'^get-ticket-data$', GetTicketData.as_view(), name="get_ticket_data")

]
#+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
