import React, { Component } from "react";
import SortingPage from "./SortingPage";
import Room from "./Room";
import Options from "./Options";
import { Grid, Button, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  // aasync tells program we don't need to wait for it to finish to do other stuff
  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Spotify Playlist Creator
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="primary" to="/sorting" component={Link}>
            Create a Playlist
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="primary" to="/options" component={Link}>
            Information and Options
          </Button>
        </Grid>
      </Grid>
    );
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              );
            }}
          />
          <Route path="/sorting" component={SortingPage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          />
          <Route path="/options" component={Options} />
        </Switch>
      </Router>
    );
  }
}