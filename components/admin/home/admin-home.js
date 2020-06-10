import React from 'react';
import Layout from '../../../containers/page-layout';
import AdminBooksList from '../books/index.js';
import Storage from '../../../local-storage'; 

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userProfile: {},
			showError: false
		}
	}

	componentDidMount = () => {
		let userProfile = Storage.getUserProfile();
        if(userProfile && userProfile.role === 'admin') {
			this.setState({userProfile: userProfile});
       } else {
            this.setState({showError: true});
        }
	}

	render() {
		return (
			!this.state.showError ? 
			<Layout selectedTab="home">
				<div className="container-admin-home home-page"> 
					<div className="left-content">
						<div className="left-menu">
						</div>
					</div>
					<div className="right-content">
						<div className="container">
							<div className="row">
								<AdminBooksList />
							</div>
						</div>
					</div>
				</div>
			</Layout>: 
			<div className="alert alert-danger alert-block">
            	<button className="close" data-dismiss="alert">&times;</button>
                <span>You do not have access to this page or your session has been expired. <a href="/" className="alert-link">Login</a></span>
            </div>

		)
	}
}