from django.urls import path
from .views import index

# when you enter a url, this file sends you to the correct location
# path ('url', page)


# When you create a path or url, have to add it to both django and react
# in react, add it to home page router section
# in django, add it here
urlpatterns = [
    path('', index),
    path('join', index),
    path('create', index)
]
