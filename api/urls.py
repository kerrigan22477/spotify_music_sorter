from django.urls import path
from .views import UserView, GetUser, SortingPageView, UserLoggedIn, LeaveSorted, UpdateSorted

urlpatterns = [
    # if we get a blank url, call main func in views.py
    # if we get a 'full' url, redirect to server/full/
    # can have multiple endpoints (home and '' go to main)

    # redirect to UserView class, and make path the view from it 
    # this is what .as_view() does
    path('user', UserView.as_view()),
    path('get-user', GetUser.as_view()),
    path('sorting-page', SortingPageView.as_view()),
    path('user-logged-in', UserLoggedIn.as_view()),
    path('leave-sorted', LeaveSorted.as_view()),
    path('update-sorted', UpdateSorted.as_view())
]