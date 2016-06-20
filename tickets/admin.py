from django.contrib import admin

from .models import NinjaUsers

@admin.register(NinjaUsers)
class NinjaUsers(admin.ModelAdmin):
    pass