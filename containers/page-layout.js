import React from 'react';
import  { Redirect } from 'react-router-dom'
import ClassNames from 'classnames'
import store from '../store'
import Storage from '../local-storage';

export default class PageLayout extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
			userProfile: {},//store.getState().userReducer.user,
			redirectToBookCategories: false,
			redirectToHome: false,
			redirectToBooks: false,
			redirectToAuthors: false,
			redirectToCart: false,
			redirectToPublishers: false,
			itemsList: [],
			results: [], 
			redirectToContact: false
		}	
		//console.log('STORE=======================================', store.getState());		
	  }
	  
	  componentDidMount = () => {
		let userProfile = Storage.getUserProfile();
		if(userProfile) { 
			this.setState({userProfile: userProfile});
        	this.getShoppingCartDetails(userProfile.id);
		} else {

		}

			
	}

	getShoppingCartDetails = (id) => {
		$.ajax({  
            type: "POST",  
            url: "http://localhost:5000/get-cart-details",  
            data: JSON.stringify({"customer_id": id}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            success: (data) => {
				if(data[0]['error']) {
					this.setState({showError: true});
					this.setState({itemsList: []});// If error it means there is no item in array
				} else {
					this.setState({itemsList: data}); 
				}     
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        });
	}
	
	onClickBookCategories = () => {
		this.setState({redirectToBookCategories: true})
	}

	setBookCategoriesTabClass =  () => {
		return ClassNames(
		'menu categories', this.props.selectedTab === 'book-categories' ? this.props.selectedTab : '')
	}

	onClickBooks = () => {
		this.setState({redirectToBooks: true})
	}

	setBooksTabClass =  () => {
		return ClassNames(
		'menu books-list', this.props.selectedTab === 'books' ? this.props.selectedTab : '')
	}

	onClickHome = () => {
		this.setState({redirectToHome: true})
	}

	  setHomeTabClass =  () => {
		return ClassNames(
		'menu home-simple', this.props.selectedTab === 'home' ? this.props.selectedTab : '')
	}  

	onClickAuthors = () => {
		this.setState({redirectToAuthors: true})
	}

	setAuthorsTabClass =  () => {
		return ClassNames(
		'menu authors-list', this.props.selectedTab === 'authors' ? this.props.selectedTab : '')
	}

	onClickPublishers = () => {
		this.setState({redirectToPublishers: true})
	}

	setPublishersTabClass =  () => {
		return ClassNames(
		'menu publishers-list', this.props.selectedTab === 'publishers' ? this.props.selectedTab : '')
	}

	onClickCart = () => {
		this.setState({redirectToCart: true})
	}

	isAdmin = () => {
		return false;//store.getState().userReducer.user.role === "Admin" 
	}

	setLeftMenuClass =  () => { 
		return ClassNames(
		'container-menu', this.isAdmin() ?  '' : 'hide-left-menu-non-admin')
	}

	setContainerMainPageClass =  () => { 
		return ClassNames(
		'container-page', this.isAdmin() ?  '' : 'container-page-non-admin')
	}

	autoSuggestBooks = () => {
        $.ajax({  
			type: "POST",  
            url: "http://localhost:5000/search-books", 
            data: JSON.stringify({"prefix": this.state.query}), 
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (data) => { 
				this.setState({
                    results: data
                  })
			},
			error: ()=> { } 
        });

    }
    
    handleInputChange = () => {
        this.setState({
          query: this.search.value,
          showSuggestions: true
        }, () => {
          if (this.search.value && this.search.value.length > 1) {
            if (this.search.value.length % 2 === 0) {
              this.autoSuggestBooks()
            }
          } else if (!this.search.value) {
          }
        })
      }
    
      handleBooksTitleChange = (langValue) => {
        this.setState({language: langValue, showSuggestions: false});
        this.search.value = langValue
	}
	
	simplSearch = () => {
        let keyword = this.state.language
        $.ajax({  
			type: "POST",  
            url: "http://localhost:5000/search", 
            data: JSON.stringify({"keyword": keyword}), 
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (data) => { 
                console.log(data)
				this.setState({booksList: data})
			},
			error: ()=> { } 
        });
	}
	
	goHome = () => {
		this.setState({redirectToHome: true})
	}

	gotoContact = () => {
		this.setState({redirectToContact: true});
	}

	render () {

		return (
			<div className='container-home-page'> 
				<div className="container">
					<div className="row">
						<div className="col order-last">
							<div className='container-user-profile'>
								{this.state.userProfile ? <div className='conatiner-welcome'><span className="welcome-label">Welcome:</span> <span className="welcome-label" >{this.state.userProfile.name}</span><span><a href="/" className='welcome-label logout'>Logout</a></span>
								</div> : null }
								{ this.state.userProfile.role !== 'admin' ?<div className="shopping-cart" onClick={this.onClickCart}>
									<i className="fa fa-shopping-cart icon-cart" >
										<span className="label-cart"> My Shopping Cart</span>
									</i>
								
									<div className="circleBase type3">{this.state.itemsList.length}</div>
		</div> : null} 
							</div>
						</div>
						
						<div className="col order-1">
						<div className="help-contact-us">
						<i className="fa fa-home icon-home" onClick={this.goHome}></i>
						<i className="fa fa-envelope icon-envelope" onClick={this.gotoContact}>
							<span className="contact-us-label">Contact Us</span>
						</i>
						<i className="fa fa-info-circle icon-envelope" >
							<span className="contact-us-label">Help</span>
						</i>
						</div>
						{/* <img className='logo' src='http://localhost:8080/Online-Book-Clubs.png' alt='Talent Manager'  /> */}
						</div>
					</div>
					        
				</div>
				
				
				<div className='container-middle-page'>
					<div className={this.setLeftMenuClass()} >
						{this.isAdmin() ?
					<span>  
						<div className={this.setHomeTabClass()} onClick={this.onClickHome}>Home</div>
							<div className={this.setBookCategoriesTabClass()} onClick={this.onClickBookCategories}>Book Categories</div>
						<div className={this.setBooksTabClass()} onClick={this.onClickBooks} >Books</div>
						<div className={this.setAuthorsTabClass()} onClick={this.onClickAuthors} >Authors</div>
						<div className={this.setPublishersTabClass()} onClick={this.onClickPublishers} >Publishers</div></span>: null}
					</div>	
					<div className={this.setContainerMainPageClass()}>{this.props.children}</div>			
					
				</div>
				
				{this.state.redirectToBookCategories && <Redirect to='/book-categories' />}		
				{this.state.redirectToHome && <Redirect to='/home' />}	
				{this.state.redirectToBooks && <Redirect to='/books' />}   
				{this.state.redirectToAuthors && <Redirect to='/authors' />} 
				{this.state.redirectToPublishers && <Redirect to='/publishers' />}	
				{this.state.redirectToCart && <Redirect to='/cart' />} 
				{this.state.redirectToContact && <Redirect to="/contact" />} 
	</div>
		)
	}
}
PageLayout.propTypes = {
	selectedTab: React.PropTypes.string
}