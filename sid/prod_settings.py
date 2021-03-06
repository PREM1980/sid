"""
Django settings for sid project.

Generated by 'django-admin startproject' using Django 1.8.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import socket

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'vl4f93bx$(hg&wvs^%f5gk%345)3wj7chwl&h0atl##mqqh#@t'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Get HostName

HOSTNAME = socket.gethostname()



# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
)

CUSTOM_APPS = ('tickets',
    'vbo_module')


INSTALLED_APPS = INSTALLED_APPS + CUSTOM_APPS

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'sid.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sid.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases
if HOSTNAME in ['test-ninja-web-server','prod-ninja-web-server']:
    if HOSTNAME == 'test-ninja-web-server':
        host = 'test-sid-web-server'
        VBO_SERVER = 'http://test-api-box:9000/'
    else:
        host = ''
        VBO_SERVER = 'prod-api-web-server'
elif HOSTNAME in ['test-sid-web-server','prod-sid-web-server']:
    host = 'localhost'
else:
    host = 'localhost'
    VBO_SERVER = 'http://localhost:9000/'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        #'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'NAME': 'sid',
        'USER': 'ninja',
        'PASSWORD': 'ninja!@#$',
        'HOST': host,
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

#STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_ROOT = '/var/www/sid/static/'

STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)

STATIC_URL = '/static/'

# logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'django': {
            'level':'DEBUG',
            'class':'logging.handlers.RotatingFileHandler',
            'filename': '/var/www//logs/sid.log',
            'maxBytes': 1024*1024*5, # 5 MB
            'backupCount': 5,
            'formatter':'verbose',
        }, 
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/var/www//logs/sid.log',
            'formatter': 'verbose'
        },
        'feedback_log_file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': '/var/www//logs/feedback.log',
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'app_logger': {
            'handlers': ['file'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'feedback_logger': {
            'handlers': ['feedback_log_file'],
            'level': 'DEBUG',
        },
    }
}

SESSION_COOKIE_AGE = 500* 60

API_KEY = 'CPT74QBAWFIDFH4U27RT'

LOCAL_TEST_NINJA = False
NINJA = False

