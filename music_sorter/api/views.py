from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserSerializer, SortingPageSerializer, UpdateSortedSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# allows us to view and create room for each user. (room holds all user data, displayed on room page)
# this class also gives us a fancy view
class UserView(generics.CreateAPIView):
    # get all existing logged in user's info 
    queryset = User.objects.all()


# get user's info (aka) data associated with them
class GetUser(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        # if user hasn't logged in, make them login and store them in system
        if code != None:
            user = User.objects.filter(code=code)
            if len(user) > 0:
                data = UserSerializer(user[0]).data
                data['is_user'] = self.request.session.session_key == user[0].user
                return Response(data, status=status.HTTP_200_OK)
            return Response({'User Not Found': 'invalid user code'}, status=status.HTTP_404_NOT_FOUND)

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
            queryset = User.objects.filter(user=user)
            if queryset.exists():
                user = queryset[0]
                user.sorting_criteria = sorting_criteria
                # when updating an object by resaving it, need to use
                # this update fields method to force these fields to udpate
                user.save(update_fields=['sorting_criteria',])
                self.request.session['user_code'] = user.code
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

            # if not updating the room create a new one! 
            else:
                user = User(user=user, sorting_criteria=sorting_criteria)
                user.save()
                self.request.session['user_code'] = user.code
                return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
            
            # return room by serializing it
        return Response({'Bad Request': 'invalid data'}, status=status.HTTP_400_BAD_REQUEST)

# are they logged in and do we already have there info 
class UserLoggedIn(APIView):
    def get(self,request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code':self.request.session.get('user_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

# leave sorted page w/ there data but keep them logged in if they want to sort again
class LeaveSorted(APIView):
    def post(self, request, format=None):
        # if user already logged in, 
        if 'user_code' in self.request.session:
            # get there info 
            self.request.session.pop('user_code')
            user_id = self.request.session.session_key
            user_data = User.objects.filter(user=user_id)
            if len(user_data) > 0:
                user = user_data[0]
                user.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

# update changed sorting criteria for specific user
class UpdateSorted(APIView):
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = UpdateSortedSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.data.get('code')
            
            sorting_criteria = serializer.data.get('sorting_criteria')

            # if user is already logged in, get there specific info
            queryset = User.objects.filter(code=code)
            user = queryset[0]
            user.sorting_criteria = sorting_criteria
            user.save(update_fields=['sorting_criteria',])
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "invalid data"}, status=status.HTTP_400_BAD_REQUEST)
