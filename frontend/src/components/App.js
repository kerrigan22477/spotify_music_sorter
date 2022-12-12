import React, { Component } from 'react';
import { render } from 'react-dom';
import HomePage from './HomePage';


// react creates a bunch of components that render one another
// this is our initial component
export default class App extends Component {
    constructor(props) {
        super(props);
        // whenever state is changed, component is re-rendered
        //this.state = {
        //}
    }

    // return html to be displayed on page
    render() {
        // put all these guys in an empty <> </> because there needs to be a wrapper
        // for everything we are returning. Has to be 1 parent element
        return (<>
            <HomePage />
        </>
        );
        // to display prop type this 
        // return <h1>{this.props.name}</h1>;
        // { } allows us to put JS code inside html
    }
}

// renders our component inside our app div
const appDiv = document.getElementById('app');
// can pass in react props like this 
// render(<App name='kevin'/>, appDiv);
render(<App />, appDiv);