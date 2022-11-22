from weakref import ref
from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from api.models import Room
import time

# inherit from APIView
# API end point that returns a url
class AuthURL(APIView):

    # returns a url we can use to authenticate our application
    # this API endpoint is called in our frontend
    def get(self, request, format=None):
        # this is the data we are getting from spotify
        # will need to change for our app obvi but for tutorial it is this
        # find scopes on spotify developer website
        # scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        scopes = 'playlist-read-private playlist-read-collaborative user-library-read'

        # our front end will get and send this request
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            # requesting a code that we will use to authenticate a user
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        # take url and redirect to that page, 
        # after user logs in they are redirected to our spotify_callback function
        return Response({'url': url}, status=status.HTTP_200_OK)

    # recieve code and state from spotify
    # use it to get access to access/refresh tokens
    # after get() func above requests it
    def spotify_callback(request, format=None):
        ''' REQUEST OUR TOKENS '''
        # unique user permission code
        code = request.GET.get('code')

        # will tell us if we have an issue (display to user)
        error = request.GET.get('error')

        # tell spotify to give us our access and refresh tokens using our code
        response = post('https://accounts.spotify.com/api/token', data={
            # says we are sending an authorization code
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
        }).json()
        # ^^^ converts it into json

        '''STORE OUR TOKENS'''
        # get our stuff from spotify
        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')
        error = response.get('error')

        # checks for a session key, if doesn't exist it makes one
        if not request.session.exists(request.session.session_key):
            request.session.create()

        # store user info in database
        update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

        ''' GO BACK TO OUR WEBPAGE '''
        # take you to different webpage
        # if want to redirect to a different app, we do the app:page in app we want to go to
        # for room page, we would do 'frontend:room'
        # this just takes us to frontend home page

        # to do this!!! you have to name your app and its home path, which we did in frontend/urls.py
        return redirect('frontend:')

class IsAuthenticated(APIView):
    # call our util function to check for authentication
    # convert response into json so our frontend understands
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)


'''
class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')

        # get current room by looking through all Room objects for curr code
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        # in case user isn't the host and wants song info
        host = room.host

        # end point to access spotify currently playing data
        endpoint = 'player/currently-playing'

        # send request to spotify(use token) in util.py
        response = execute_spotify_api_request_curr_song(host, endpoint)
        print(response)

        # extract specific info from response
        # item has a key we want in response
        if 'error' in response or 'item' not in response:
            # if no song info, return nothing to frontend
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        # go through what spotify returns
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        # a bunch of nested dictionaries
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        # if multiple artists for a song, handle weird formatting
        artist_string = ''
        # if multiple in the list -> reformat
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ', '
            name = artist.get('name')
            artist_string += name

        # return our custom 'song' object that we wanna send to the frontend
        # this endpoint calls the spotify endpoint to send necessary info
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }

        # send back our reformatted info from spotify
        return Response(song, status=status.HTTP_200_OK)
'''
class UserPlaylists(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')

        # get current room by looking through all Room objects for curr code
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

        # in case user isn't the host and wants song info
        host = room.host

        # end point to access spotify user's playlist data
        get_playlists_endpoint = 'me/playlists'

        # send request to spotify(use token) in util.py
        response = execute_spotify_api_request(host, get_playlists_endpoint)
        # print(response)

        # get each playlist's data from response
        playlists = response.get('items')
        time.sleep(.25)

        # get id for each playlist 
        track_ids = []
        track_ids2 = {}
        for item in playlists:
            id = item.get('id')

            # endpoint to access all the tracks in a specific playlist 
            curr_playlist_endpoint = 'playlists/' + str(id) + '/tracks'
            # ask spotify for the specific playlist's songs (tracks)
            response2 = execute_spotify_api_request(host, curr_playlist_endpoint)
            time.sleep(.15)
            # print('response2: ' + str(response2.get('items')))

            response3 = response2.get('items')
            for song in response3:
                response5 = song.get('track')
                track_id = response5.get('id')
                track_name = response5.get('name')
                #print('response2: ' + str(track_id))

                track_ids.append(track_id)
                track_ids2[track_id] = track_name

        #for track in track_ids:
        #print(track_ids2)
        finalList = []
        for id in track_ids2.keys():
            name = track_ids2[id]
            # track_endpoint = 'tracks/' + str(track)
            track_endpoint = 'audio-features/' + str(id)
            # get track data from spotify
            response6 = execute_spotify_api_request(host, track_endpoint)
            # need to wait for this to get called, otherwise reutrns none for all vals

            song = {
                'title': name,
                'danceability': response6.get('danceability'),
                'energy': response6.get('energy'),
                'key': response6.get('key'),
                'mode': response6.get('mode'),
                'valence': response6.get('valence'),
                'tempo': response6.get('tempo'),
                'instrumentalness': response6.get('instrumentalness'),
                'id': id
            }
            finalList.append(song)
        print(finalList)
        # send back our reformatted info from spotify
        return Response(response, status=status.HTTP_200_OK)