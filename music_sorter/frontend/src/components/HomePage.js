import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import { 
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from 'react-router-dom';

export default class HomePage extends Component {
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

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                    <p>This is the home page</p>
                    </Route>
                    <Route path="/join" component={RoomJoinPage} />
                    <Route path="/create" component={CreateRoomPage} />
                    <Route path='room/:roomCode' componenet={Room} />
                </Switch>
            </Router>
        );
    }
}