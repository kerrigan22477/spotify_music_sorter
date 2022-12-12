from django.shortcuts import render

# allows us to render our index template in templates/frontend/index.html
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

