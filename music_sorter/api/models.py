from django.db import models
import string
import random

def generate_unique_code():
    length = 5

    while True:
        # generate random code of len=k w/ uppercase asci characters
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # check all room objects in the database, and filter to see if 
        # they have a code = our code, and if there is one, re generate
        # #if not, break and return code 
        if User.objects.filter(code=code).count() == 0:
            break
    return code

class User(models.Model):
    # store a bunch of characters, with these parameters
    code = models.CharField(max_length=10, default=generate_unique_code, unique=True)
    user = models.CharField(max_length=30, unique=True)

    # have to input something, if not answer is key
    sorting_criteria = models.CharField(max_length=20, null=False, default='key')
    # never have to pass date/time obj, when we create room it is
    # automatically added
    created_at = models.DateTimeField(auto_now_add=True)

