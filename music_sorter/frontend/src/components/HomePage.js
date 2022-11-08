import React, { Component } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import { 
    BrowserRouter as Router,
    Routes,
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
                <Routes>
                    <Route path="/" element={<p>This is s the HomePage</p>} />
                    <Route path="/join/*" element={<RoomJoinPage />} />
                    <Route path="/create" element={<CreateRoomPage />} />
                    <Route path="/room/:roomCode" element={<Room/>} />
                </Routes>
            </Router>
        );
    }
}