import React, { Component } from "react";
import SortingPage from "./SortingPage";
import User from "./User";
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
      userCode: null,
    };
    this.clearUserCode = this.clearUserCode.bind(this);
  }

  // aasync tells program we don't need to wait for it to finish to do other stuff
  async componentDidMount() {
    fetch("/api/user-logged-in")
      .then((response) => response.json())
      .then((data) => {
	this.setState({
	  userCode: data.code,
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

  clearUserCode() {
    this.setState({
      userCode: null,
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
	      return this.state.userCode ? (
		<Redirect to={`/user/${this.state.userCode}`} />
	      ) : (
		this.renderHomePage()
	      );
	    }}
	  />
	  <Route path="/sorting" component={SortingPage} />
	  <Route
	    path="/user/:userCode"
	    render={(props) => {
	      return <User {...props} leaveRoomCallback={this.clearUserCode} />;
	    }}
	  />
	  <Route path="/options" component={Options} />
	</Switch>
      </Router>
    );
  }
}