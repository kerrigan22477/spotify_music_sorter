import numpy as np


class Sort_Songs():
    def song_sort(self, playlists, criteria):
        #We should be getting the criteria here, this is where the buttons are needed, pass it in or we can try to
        #get it over here somehow
        criteria = "key"
        #playlists = UserPlaylists.get()
        test = False
        #If your testing this will create some random things to test with beacuse I was struggling
        if test == True:
            songs = []
            for i in range(10):
                song = {
                    'title': "song" + str(i + 1),
                    'danceability': np.random.random(),
                    'energy': np.random.random(),
                    'key': np.random.random(),
                    'mode': np.random.random(),
                    'valence': np.random.random(),
                    'tempo': np.random.random(),
                    'instrumentalness': np.random.random(),
                    'id': np.random.random(),
                    }
                songs.append(song)

        #sorting
        playlists = sorted(playlists, key = lambda x: x[criteria])


        return playlists



