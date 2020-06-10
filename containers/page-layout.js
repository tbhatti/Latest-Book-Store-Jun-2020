import React from 'react';
import { Redirect } from 'react-router-dom'
import ClassNames from 'classnames';
import Storage from '../local-storage';
import CountShoppingItems from './count-shopping-items';
import Service from '../api-service';
import PubSub from 'pubsub-js';

export default class PageLayout extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userProfile: {},
			categories: [],
			authors: [],
			redirectToAdminHome: false
		}
	}

	componentDidMount = () => {
		let userProfile = Storage.getUserProfile();
		if (userProfile) {
			this.setState({ userProfile: userProfile });
			
		} else {
		}
		this.getCategoriesList();
		this.getAuthorsList();
		
	}

	getCategoriesList = () => {
		let data = Service.getCategoriesListRequest()
		this.setState({ categories: data });
	}

	getAuthorsList = () => {
		let data = Service.getAuthorsListRequest()
		this.setState({ authors: data });
	}

	renderBookCategories = (row) => {
		return (
			<ul className="list-categories" >
				{this.state.categories.map(function (cat, index) {
					return <li key={index} onClick={() => this.categoryClickEvent(cat)}>{cat.name}</li>;
				}, this)}
			</ul>
		)
	}

	renderAuthors = () => {
		return (
			<ul className="list-categories" >
				{this.state.authors.map(function (author, index) {
					return <li key={index} onClick={() => this.authorClickEvent(author)}>{author.name}</li>;
				}, this)}
			</ul>
		)
	}

	categoryClickEvent = (category) => {
		let books = Service.filterBooksByCategory(category.name);
		PubSub.publish('books.updated', books);
	}

	authorClickEvent = (author) => {
		let books = Service.filterBooksByAuthor(author.name)
		PubSub.publish('books.updated', books);
	}

	toBooksList = () => {
		this.setState({redirectToAdminHome: true});
	}

	render() {
		return (
			this.state.userProfile ? <div className='page-layout'> 
				<div className="container">
					<div className="row">
						<div className="col order-last">
							<div className='container-user-profile'>
								{this.state.userProfile ? 
									<div className='conatiner-welcome'><span className="welcome-label">Welcome:</span> <span className="welcome-label" >{this.state.userProfile.name}</span><span><a href="/" className='welcome-label logout'>Logout</a></span>
									</div> :
								 null}
								{this.state.userProfile.role !== 'admin' ?
									<CountShoppingItems></CountShoppingItems> : 
								null}
							</div>
						</div>

						<div className="col order-1">
							<div className="help-contact-us">
								<i className="fa fa-home icon-home"></i>
								<i className="fa fa-envelope icon-envelope">
									<span className="contact-us-label">Contact Us</span>
								</i>
								<i className="fa fa-info-circle icon-envelope" >
									<span className="contact-us-label">Help</span>
								</i>
							</div>

						</div>
					</div>

				</div>

				<div className='container-top-header-logo'>
					<div className="logo-container"> <img className='logo' src='../../assets/logo.png' alt='Talent Manager' />
					</div>
				</div>
				{this.state.userProfile.role === 'admin' && this.props.selectedTab !== 'cart' ?
				<div className="container-drop-down-menu">						
						<span className={"books-list " + (this.state.redirectToBooks ? 'border-bottom' : '')}  onClick={this.toBooksList}><i className="fa fa-book fa-enlarge-icon"></i>Books</span>
						<span className="books-categories"><i className="fa fa-list-alt fa-enlarge-icon"></i>Book Categories</span>
						<span className="authors-list"><i className="fa fa-user fa-enlarge-icon"></i>Authors</span>
						<span className="publishers-list"><i className="fa fa-newspaper-o fa-enlarge-icon"></i>Publishers</span>
				</div>
				:
				this.props.selectedTab !== 'cart' ? <div className="container-drop-down-menu-non-admin left-gap">
						<span className="drop-dwon">Shop By Category
								<span className="fa fa-chevron-down"> </span>
							<span className="fa fa-chevron-up"> </span>
							<div className="container-categories">
								<div className="column-left">
									<div className="top-categories">Top Categories</div>
									{this.state.categories.length > 0 ? this.renderBookCategories() : null} 
								</div>
								<div className="column-middle">
									<div className="top-authors">Top Authors</div>
									{this.state.authors.length > 0 ? this.renderAuthors() : null} 
								</div>

							</div>
						</span>
						<span className="top-sellers">Top Sellers</span>
						<span className="coming-soon">Coming Soon</span>
						<span className="highlights">Highlights</span>
						<span className="bargain">Bargain Shop</span>
					</div> : null }
				<div className='container-middle-page'>
					<div>{this.props.children}</div>
				</div>
				{this.state.redirectToAdminHome && <Redirect to={`/admin`} />}
			</div> : null
		)
	}
}
PageLayout.propTypes = {
	selectedTab: React.PropTypes.string
}