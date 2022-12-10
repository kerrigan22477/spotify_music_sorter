from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, SortingPageSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# allows us to view and create room for each user. (room holds all user data, displayed on room page)
# this class also gives us a fancy view
class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()


# get user's info (aka data associated with them)
class GetRoom(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        # if user hasn't logged in, make them login and store them in system
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_user'] = self.request.session.session_key == room[0].user
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


# API view allows us to overwrite some default stuff
# page for selecting sorting criteria
class SortingPageView(APIView):
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
        serializer = SortingPageSerializer(data=request.data)
        if serializer.is_valid():
            sorting_criteria = serializer.data.get('sorting_criteria')
            user = self.request.session.session_key

            # if user already has a room and tries to make a new one,
            # there room will have the same code but with the updated settings
            queryset = Room.objects.filter(user=user)
            if queryset.exists():
                room = queryset[0]
                room.sorting_criteria = sorting_criteria
                # when updating an object by resaving it, need to use
                # this update fields method to force these fields to udpate
                room.save(update_fields=['sorting_criteria',])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            # if not updating the room create a new one! 
            else:
                room = Room(user=user, sorting_criteria=sorting_criteria)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
            
            # return room by serializing it
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# are they in the room page that contains there data
class UserInRoom(APIView):
    def get(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code':self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

# leave room page w/ there data but keep them logged in if they want to sort again
class LeaveRoom(APIView):
    def post(self, request, format=None):
        # if user already logged in, 
        if 'room_code' in self.request.session:
            # get there info 
            self.request.session.pop('room_code')
            user_id = self.request.session.session_key
            room_results = Room.objects.filter(user=user_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

# update changed sorting criteria for specific user
class UpdateRoom(APIView):
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = UpdateRoomSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.data.get('code')
            
            sorting_criteria = serializer.data.get('sorting_criteria')

            # if user is already logged in, get there specific info
            queryset = Room.objects.filter(code=code)
            room = queryset[0]
            room.sorting_criteria = sorting_criteria
            room.save(update_fields=['sorting_criteria',])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)
