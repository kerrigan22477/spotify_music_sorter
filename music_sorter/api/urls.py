from django.urls import path
from .views import RoomView

urlpatterns = [
    # if we get a blank url, call main func in views.py
    # if we get a 'full' url, redirect to server/full/
    # can have multiple endpoints (home and '' go to main)

    # redirect to RoomView class, and make path the view from it 
    # this is what .as_view() does
    path('room', RoomView.as_view()),
    
]