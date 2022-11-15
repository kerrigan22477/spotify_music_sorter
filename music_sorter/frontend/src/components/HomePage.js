import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import Generate from './Generate';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom';

/*export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    // Switch lets us look at 1 variable (url) and use it to
    // return something different

    // Route if path, return component

    /*
    # When you create a path or url, have to add it to both django and react
    in react, add it here
    in django, add it in frontend/urls.py
    */

// if you have a colon in the path, that means there will be a variable
// in our code, the varaible is roomCode
// Route by default gives us some info about the path, it gives us 
// match, which gives us access to the parameters for the url in the path

//<Route path='room/:roomCode' component={Room} />

/*render() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                <p>This is the home page</p>
                </Route>
                <Route path="/join" component={RoomJoinPage} />
                <Route path="/create" component={CreateRoomPage} />
                <Route path='/room/:roomCode' component={Room} />
            </Switch>
        </Router>
    );
}
} */

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

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
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to="/join" component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to="/create" component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
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
                    <Route path="/join" component={RoomJoinPage} />
                    <Route path="/create" component={CreateRoomPage} />
                    <Route
                        path="/room/:roomCode"
                        render={(props) => {
                            return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
                        }}
                    />
                    <Route path="/generate" component={Generate} />

                </Switch>
            </Router>
        );
    }
}