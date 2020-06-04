import React from 'react';
import { Redirect } from 'react-router-dom'
import Layout from '../../../containers/page-layout'
import  store  from '../../../store'
import StarRatings from 'react-star-ratings';
import Service from '../../../api-service'
import AdminBooksList from '../books/index.js';
import $ from 'jquery'
import Storage from '../../../local-storage'; 

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userProfile: {},
			redirectToBooks: true
		}
	}

	componentDidMount = () => {
		let userProfile = Storage.getUserProfile();
        if(userProfile && userProfile.role === 'admin') {
			this.setState({userProfile: userProfile});
			$.ajax({
				type: "GET",
				url: "http://localhost:5000/publishers-list",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: (data) => {
					this.setState({ publishersList: data });
				},
				error: () => { }
			});
        } else {
            this.setState({showError: true});
        }
		
	}

	toBooksList = () => {
		this.setState({ redirectToBooks: true})
	}

	

	render() {
		return (
			!this.state.showError ? <Layout selectedTab="home">
				<div className="page-container-layout home-page"> 
					<div className='container-top-header'>
						<div className="logo-container"> <img className='logo' src='../../assets/logo.png' alt='Talent Manager' />
							
						</div>
						
					</div>
					<div className="container-drop-down-menu">
						
						<span className={"top-sellers " + (this.state.redirectToBooks ? 'border-bottom' : '')}  onClick={this.toBooksList}><i className="fa fa-book fa-enlarge-icon"></i>Books</span>
						<span className="coming-soon"><i className="fa fa-list-alt fa-enlarge-icon"></i>Book Categories</span>
						<span className="highlights"><i className="fa fa-user fa-enlarge-icon"></i>Authors</span>
						<span className="bargain"><i className="fa fa-newspaper-o fa-enlarge-icon"></i>Publishers</span>
					</div>

					<div className="left-content">
						{this.state.showLeftMenu ? <div className="left-menu">
							<h3>Filter your search</h3>
							
						</div>
							:
							<div className="left-menu-contents"></div>
						}
					</div>
					<div className="right-content">
						 
						<div className="container">
							<div className="row">
							{this.state.redirectToBooks && <AdminBooksList />}
							</div>
						</div>
					</div>
				</div>
			</Layout>: <div className="alert alert-danger alert-block">
                    <button className="close" data-dismiss="alert">&times;</button>
                        <span>Your Session Expired! Please <a href="/" className="alert-link">Login Again</a></span>
                </div>

		)
	}
}



