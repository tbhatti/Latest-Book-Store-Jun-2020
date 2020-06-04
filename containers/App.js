import React, {Component} from 'react';
import {connect} from 'react-redux';
import Login from '../components/login/login.js';

class App extends Component {	
    render () {
        return (
        	<div>
                <Login />
            </div>
        )
    }
}

export default App;