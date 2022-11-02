from django.db import models
import string
import random

def generate_unique_code():
    length = 6

    while True:
        # generate random code of len=k w/ uppercase asci characters
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # check all room objects in the database, and filter to see if 
        # they have a code = our code, and if there is one, re generate
        # #if not, break and return code 
        if Room.objects.filter(code=code).count() == 0:
            break

    return code

class Room(models.Model):
    # store a bunch of characters, with these parameters
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    # have to input something, if not answer is no
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    # never have to pass date/time obj, when we create room it is
    # automatically added
    created_at = models.DateTimeField(auto_now_add=True)



    '''
    can add methods, Ex:

    def is_host_this(host):
         whatever

    # who is using the spotify account
    user = models.CharField(max_length=50, unique=True)
    '''

