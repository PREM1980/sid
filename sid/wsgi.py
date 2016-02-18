"""
WSGI config for sid project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/howto/deployment/wsgi/
"""

import os
import site
import sys

#Add the site-packges from the virtualenv
site.addsitedir('/var/www/venv/lib/python2.7/site-packages')

#Add the apps directory to the Python Path
sys.path.append('/var/www/sid')
sys.path.append('/var/www/sid/sid')

#Activate your virtual env
activate_env=os.path.expanduser('/var/www/venv/bin/activate_this.py')
execfile(activate_env,dict(__file__=activate_env))


from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sid.dev_settings")

application = get_wsgi_application()
