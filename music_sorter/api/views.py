from django.shortcuts import render
from django.http import HttpResponse

# take in a request, return response
# return webpage basically
def main(request):
    return HttpResponse('<h1>Hello</h1>')
