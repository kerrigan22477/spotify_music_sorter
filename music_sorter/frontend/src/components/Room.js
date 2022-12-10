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
      isHost: false,
      // showSettings: false,
      spotifyAuthenticated: false,
      sorting_criteria: 'key',
      // all info of current song, if it's changed component will re-render
      playlists: [],
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getRoomDetails();
    this.getPlaylists();
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
        console.log('room data')
        console.log(data)
        this.setState({
          isHost: data.is_host,
          sorting_criteria: data.sorting_criteria
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
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

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
        // sort before setting the state
        // avoid changing state at all costs
        // it is bad practice 
        const sorted = this.sortSongs(data)
        this.setState({ playlists: sorted });
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

  sortSongs(data){
    var pitch_class_notation = {
      0: 'C',
      1: 'C#',
      2: 'D',
      3: 'D#',
      4: 'E',
      5: 'F',
      6: 'F#',
      7: 'G',
      8: 'G#',
      9: 'A',
      10: 'A#',
      11: 'B'
    };

    const crit = this.state.sorting_criteria
    if (crit === 'Key') {
      data[0][crit] = pitch_class_notation[data[0][crit]]
    }
    
    data.sort(function(a, b){
      if (crit === 'Key') {
        a[crit] = pitch_class_notation[a[crit]]
      }
      return a[crit]-b[crit]
    })
    return data
  }

  renderSortedSongs() {
    // capitilize sorting criteria to be displayed
    const crit = this.state.sorting_criteria
    const crit2 = crit.charAt(0).toUpperCase() + crit.slice(1);
    return (
      <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <TableContainer style={{ maxHeight: 900 }} component={Paper}>
          <Table stickyHeader aria-label="simple table">
              <TableHead>
              <TableRow>
                  <TableCell>Song</TableCell>
                  <TableCell align="right">Artist</TableCell>
                  <TableCell align="right">{crit2}</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>]
              {this.state.playlists
                .map(item => (
                  <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                      {item.title}
                  </TableCell>
                  <TableCell align="right">{item.artist}</TableCell>
                  <TableCell align="right">{item[this.state.sorting_criteria]}</TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={this.leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>

    )
  }

  render() {
    // wait for songs to get sorted and then
    if (this.state.playlists.length != 0) {
      return this.renderSortedSongs();
    }
    console.log(this.state.playlists)
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

/*
      <TableContainer style={{ maxHeight: 900 }} component={Paper}>
      <Table stickyHeader aria-label="simple table">
          <TableHead>
          <TableRow>
              <TableCell>Song</TableCell>
              <TableCell align="right">Artist</TableCell>
              <TableCell align="right">{crit2}</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>]
          {this.state.playlists
            .map(item => (
              <TableRow key={item.id}>
              <TableCell component="th" scope="row">
                  {item.title}
              </TableCell>
              <TableCell align="right">{item.artist}</TableCell>
              <TableCell align="right">{item[this.state.sorting_criteria]}</TableCell>
              </TableRow>
          ))}
          </TableBody>
      </Table>
      </TableContainer>
      */