import React, { Component } from 'react';


export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        };
        // match gives us the info about how we got to this component from Route (in homepage)
        // which allows us to access the roomcode from the parameters of the url
        this.roomCode = this.props.match.params.roomCode
    }
    render() {
        return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause}</p>
                <p>Host: {this.state.isHost}</p>
            </div>
        );
    }
}