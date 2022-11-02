from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response

'''
#take in a request, return response
# return webpage basically
def main(request):
    return HttpResponse('<h1>Hello</h1>')
'''

# allows us to view and create rooms
# this class also gives us a fancy view
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# API view allows us to overwrite some default stuff
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    # everytime you open a website you start a session. This is why
    # you can navigate between pages on instagram without having to login
    # everytime you load a new page of the app
    # sessions are identified by a unique key
    def post(self, request, format=None):
        # if current user DOES NOT have an active session with our web server
        if not self.request.session.exists(self.request.session.session_key):
            # create a session
            self.request.session.create()

        # user create room serailizer to check if request data valid
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key

            # if user already has a room and tries to make a new one,
            # there room will have the same code but with the updated
            # pausing and skip votting settings
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # when updating an object by resaving it, need to use
                # this update fields method to force these fields to udpate
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            # if not updating the room create a new one! 
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            
            # return room by serializing it
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


