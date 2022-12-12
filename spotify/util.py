from datetime import timedelta
from weakref import ref
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_SECRET, CLIENT_ID
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


# updates and or creates a new token in the data base
def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    # everytime you get a new/refresh a token, expires_in resets so that
    # expires_in=3600
    # (3600 secs = 1 hr)
    # need to convert into a time stamp cause 3600 not super handy
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])

    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)

        tokens.save()


# authenticate user by checking if they are in the database, and then if they are, 
# whether or not their token is expired
def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expiry = tokens.expires_in

        # aka if it's expired, refresh token
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        
        # token has either been refreshed or it was already gucci
        return True


    # if no tokens, they are not authenticated
    return False 

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    # ask spotify for a new access token using our refresh token
    response = post('https://accounts.spotify.com/api/token', data={
        # says we are sending a refresh token
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    # reset access_token
    access_token = response.get('access_token')

    # token type shouldn't ever change, but this is a good way to 
    # prevent bugs in the future in case spotify makes a change
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

# send request to spotify(use token) in util.py
# sesssion id = user id
# endpoint = what endpoint of spotify api we want
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    # use user's unique id to get there token
    tokens = get_user_tokens(session_id)
    # send authorization token to spotify
    headers = {'Content-Type': 'application/json', 'Authorization': "Bearer " + tokens.access_token}

    # send to endpoint
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    # check so we can see if there is an issue with response
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}