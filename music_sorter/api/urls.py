from django.urls import path
from .views import UserView, GetUser, SortingPageView, UserLoggedIn, LeaveSorted, UpdateSorted

urlpatterns = [
    # if we get a blank url, call main func in views.py
    # if we get a 'full' url, redirect to server/full/
    # can have multiple endpoints (home and '' go to main)

    # redirect to UserView class, and make path the view from it 
    # this is what .as_view() does
    path('user', UserView.as_view()),
    path('get-room', GetUser.as_view()),
    path('create-room', SortingPageView.as_view()),
    path('user-in-room', UserLoggedIn.as_view()),
    path('leave-room', LeaveSorted.as_view()),
    path('update-room', UpdateSorted.as_view())
]