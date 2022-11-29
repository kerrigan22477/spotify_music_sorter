from django.urls import path
from .views import RoomView, CreateRoomView, GetRoom, UserInRoom, LeaveRoom, UpdateRoom

urlpatterns = [
    # if we get a blank url, call main func in views.py
    # if we get a 'full' url, redirect to server/full/
    # can have multiple endpoints (home and '' go to main)

    # redirect to RoomView class, and make path the view from it 
    # this is what .as_view() does
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', UpdateRoom.as_view())
]