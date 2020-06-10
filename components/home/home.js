import React from 'react';
import { Redirect } from 'react-router-dom'
import Layout from '../../containers/page-layout'
import store from '../../store'
import StarRatings from 'react-star-ratings';
import Service from '../../api-service';
import Storage from '../../local-storage';
import PubSub from 'pubsub-js';

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userProfile: {},
			booksList: [],
			redirectToCart: false,
			bookCategories: [],
			showBooksList: true,
			showBookDetail: false,
			booksInCart: [],
			showAdvanceSearch: false
		}
		
	}

	componentDidMount = () => {
		PubSub.subscribe('books.updated', this.updateBooksList);	
		let userProfile = Storage.getUserProfile();
		this.setState({userProfile: userProfile})
		this.getCategoriesList()
		this.getBooksList()		
		this.getCartDetails(userProfile["id"]); // Needs this to check whether this book already in cart
	}

	updateBooksList = (event, books) => {
		this.setState({ booksList: books });
	}

	getCartDetails = (id) => {
        if(id) {
			let data = Service.getCartItems(id)
			this.setState({ booksInCart: data });
        } else {
            this.setState({showError: true})
       }
    }

	getCategoriesList = () => {
		let data = Service.getCategoriesListRequest()
		this.setState({ bookCategories: data });
	}

	getBooksList = () => {
		let data = Service.getBooksListRequest()
		this.setState({ booksList: data });
	}

	gotoDetail = (book) => {
		this.setState({bookID: book.id, showBookDetail: true, showBooksList: false })
	}

	addToCart = (book) => {
		let alreadyInCart = null;
		if(this.state.booksInCart) {
			alreadyInCart = this.state.booksInCart.filter(cartBook => Number(cartBook.book_id) === Number(book.id));
		}
		if (alreadyInCart && alreadyInCart.length > 0) {
			let quantity = Number(alreadyInCart[0].quantity);
			quantity += 1;
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": quantity}
			let updateCart = Service.updateQuantityToCartRequest(data)
			this.setState({ redirectToCart: updateCart })

		} else {
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": 1, "price": book.price }
			let addedToCart = Service.addToCartRequest(data)
			this.setState({ redirectToCart: addedToCart })
		}
		
	}

	handleSearchInputChange = (event) => {
		this.setState({query: event.target.value});
	}

	keywordSearchHandler = () => {
		let keyword = this.state.query
		let books = Service.keywordSearchRequest(keyword)
		this.setState({ booksList: books })
	}

	advanceSearchClickHandler = () => {
		this.setState({showAdvanceSearch: !this.state.showAdvanceSearch});
		console.log('advanceSearchClickHandleradvanceSearchClickHandler');
	}

	renderBooks = (books) => {
		return books.map((book) => {
			let imageSource = '../../assets/books/' + book.cover_image
			return <div className="col-md-2" key={book.title + book.id}>
				<a className="thumbnail" key={book.title} >
					<img src={imageSource} alt="Image" className="image-icon" onClick={() => this.gotoDetail(book)} />
					<div className="title">{book.title}</div>
					<div className="author">{book.author_name}</div>
					<div className="">
						<StarRatings rating={book.rating} starRatedColor="orange" numberOfStars={5} name='rating' starDimension="14px" starSpacing="1px" />
					</div>
					<div className="price">$ {book.price}</div>
					<button type="button" className="btn btn-primary add-to-cart" onClick={() => this.addToCart(book)}>
					<i className="fa fa-shopping-cart" aria-hidden="true"></i> Add to Cart
                            </button>
				</a>
			</div>
		})
	}
	renderBookCategoriesItems = () => {
		let classname = ''
		let activeItemFlag = false
		return this.state.bookCategories.map((category, index) => {
			const books = this.state.booksList.filter(book => book.book_category === category.name);
			if (index === 0 && books.length > 0) {
				classname = "active item"
				activeItemFlag = true
			} else if (index > 0 && books.length > 0 && !activeItemFlag) {
				classname = "active item"
			}
			else {
				classname = "item"
			}
			return books.length > 0 ? <div key={category.name + category.id} className={classname}>
				<div className="category-name">{category.name}</div>
				<div className="row" key={category.id + category.name}>
					{books.length > 0 ? this.renderBooks(books) : null}
				</div>
			</div>
				: null
		})
	}
	

	render() {
		return (
			<Layout selectedTab="home"> 
				<div className="container-non-admin-home non-admin-home-page">
					<div className={"container-top-header " + (this.state.showAdvanceSearch ? 'container-advance-search' : '')} >						
						<div className="buttons-container">
							<div className="form-group">
								<input className="form-control" placeholder="Keyword Search for books by Title / Bppk Category / Author Name" onChange={this.handleSearchInputChange} />
							</div>
							<button type="button" className="btn btn-primary btn-info search" onClick={this.keywordSearchHandler}>
								Search
							</button>
							<button type="button" className="btn btn-primary button-advanced-search" onClick={this.advanceSearchClickHandler} >
								<i className="fa fa-cog"></i> Advanced Search
							</button>
						</div>
						<div className={"container " + (this.state.showAdvanceSearch ? 'visible-advanced-search' : 'hidden-advanced-search')}>
							<div className="row">
								<div className="col-12">
									Advanced Search
								</div>
							</div>
						<div className="row">
							<div className="col-sm">
							<fieldset >
								<div className="form-group">
									<label>Keyword</label>
									<input type="text" id="Keyword" className="form-control" placeholder="Keyword"/>
								</div>
								<div className="form-group">
									<label>Title</label>
									<input type="text" id="Title" className="form-control" placeholder="Title"/>
								</div>
							</fieldset>
							</div>
							<div className="col-sm">
							<fieldset >
								<div className="form-group">
									<label>Category</label>
									<input type="text" id="Category" className="form-control" placeholder="Category"/>
								</div>
								<div className="form-group">
									<label>Author</label>
									<input type="text" id="Author" className="form-control" placeholder="Author"/>
								</div>
							</fieldset>
							</div>
							<div className="col-sm">
							<fieldset >
								<div className="form-group">
									<label>Publisher</label>
									<input type="text" id="Publisher" className="form-control" placeholder="Publisher"/>
								</div>
								<div className="form-group">
								
								<button type="button" className="btn btn-primary advance" >
									Search
								</button>
								</div>
							</fieldset>
							</div>
						</div>
						</div>
					</div>
			
					<div className="left-content">
						<div className="left-menu">
						</div>
					</div>
					<div className="right-content">
						{/*Carousal Starts here**/}
						<div className="container"> 
							
							<div className="row">
							<div className="col-md-12">
							{this.state.showBooksList &&
									<div id="Carousel" className="carousel slide">
										<ol className="carousel-indicators">
											<li data-target="#Carousel" data-slide-to="0" className="active"></li>
											<li data-target="#Carousel" data-slide-to="1"></li>
											<li data-target="#Carousel" data-slide-to="2"></li>
										</ol>
										<div className="carousel-inner">
											{this.state.bookCategories.length > 0 && this.state.booksList.length > 0 ? this.renderBookCategoriesItems() : null}
										</div>
										<a data-slide="prev" href="#Carousel" className="left carousel-control">‹</a>
										<a data-slide="next" href="#Carousel" className="right carousel-control">›</a>
							</div> }
								</div>
							</div>
						</div>
					</div>
				</div>
				

				{this.state.redirectToCart && <Redirect to="/cart" />}
				{this.state.showBookDetail && <Redirect to={`/books/${this.state.bookID}`} />}
			</Layout>

		)
	}
}



