import React from 'react';
import {Link} from 'react-router-dom';

export default class Home extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
    		}
      }

	componentDidMount = () => {
    }

	render () {
		return (
			<div className="container">
            <div className="row">
            <div className="col-sm-6 col-md-4 col-md-offset-4">
                    <span className="text-center login-title">Sign in to continue to Bootsnipp</span>
                    <div className="account-wall">
                        <input type="text" className="form-control" placeholder="Email" />
                        <input type="password" className="form-control" placeholder="Password" />
                        <button className="btn btn-lg btn-primary btn-block" type="submit" >
                            Sign in</button>                          
                            
                        
                    </div>
                  
                </div>
            </div>
            
        </div>
		)
	}
}