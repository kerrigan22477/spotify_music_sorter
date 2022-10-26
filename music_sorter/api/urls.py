from django.urls import path
from .views import main

urlpatterns = [
    # if we get a blank url, call main func in views.py
    # if we get a 'full' url, redirect to server/full/
    # can have multiple endpoints (home and '' go to main)
    path('home', main),
    path('', main)
]