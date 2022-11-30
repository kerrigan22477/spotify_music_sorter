import React, { Component } from "react";
import {
  Grid,
  Button,
  Typography,
} from "@material-ui/core";

import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      // all info of current song, if it's changed component will re-render
      playlists: [],
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSortedSongs.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getPlaylists();
    this.getRoomDetails();
  }

  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (this.state.isHost) {
          this.authenticateSpotify();
        }
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }
  /*
  getCurrentSong() {
    // fetch our api-endpoint (url)
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
      });
  }
  */

  getPlaylists() {
    // fetch our api-endpoint (url)
    fetch("/spotify/playlists")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ playlists: data });
      });
  }
  
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  renderSortedSongs() {
    return (
      <TableContainer component={Paper}>
      <Table aria-label="simple table">
          <TableHead>
          <TableRow>
              <TableCell>Song</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">Key</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
          {this.state.playlists.map(item => (
              <TableRow key={item.id}>
              <TableCell component="th" scope="row">
                  {item.title}
              </TableCell>
              <TableCell align="right">{item.artist}</TableCell>
              <TableCell align="right">{item.key}</TableCell>
              </TableRow>
          ))}
          </TableBody>
      </Table>
      </TableContainer>
    )
  }

  render() {
    // wait for songs to get sorted
    if (this.state.playlists.length != 0) {
      return this.renderSortedSongs();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            loading
          </Typography>
        </Grid>
      </Grid>
    );
  }
}