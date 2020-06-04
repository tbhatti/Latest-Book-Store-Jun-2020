import React from 'react';
import { Redirect } from 'react-router-dom'
import Layout from '../../containers/page-layout'
import store from '../../store'
import StarRatings from 'react-star-ratings';
import Service from '../../api-service'
import BookDetail from '../admin/books/view';
import Storage from '../../local-storage';
//import AdvanceSearch from '../advanced-search'
//import FilterSearch from '../filter-search'

export default class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userProfile: {},//store.getState().userReducer.user,
			bookCategories: [],
			booksList: [],
			redirect: false,
			bookID: 0,
			redirectToCart: false,
			authorsList: [],
			bookCategories: [],
			selectedBookCategory: '',
			selectedAuthor: '',
			results: [],
			showAdvanceSearch: false,
			publishersList: [],
			showLeftMenu: false,
			bookDetail: {},
			showBooksList: true,
			showBookDetail: false,
			itemsList: []
		}
	}

	componentDidMount = () => {
		
		let userProfile = Storage.getUserProfile();
		this.setState({userProfile: userProfile})
		this.getCategoriesList()
		this.getBooksList()
		this.getAuthorsList()
		this.getCartDetails(userProfile["id"]);
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
	}

	getCartDetails = (id) => {
        if(id) {
            $.ajax({  
                type: "POST",  
                url: "http://localhost:5000/get-cart-details",  
                data: JSON.stringify({"customer_id": id}),  
                contentType: "application/json; charset=utf-8",    
                dataType: "json",
                success: (data) => {                   
				   this.setState({itemsList: data});
                },
                error: ()=> { console.log('There is no item in your shoping cart') } 
            });
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

	getAuthorsList = () => {
		let data = Service.getAuthorsListRequest()
		this.setState({ authorsList: data });
	}

	gotoDetail = (book) => {
		console.log('==================================================================', book);
		this.setState({ redirect: true, bookID: book.id, bookDetail: book, showBookDetail: true, showBooksList: false })
	}

	changeHandler = (value) => {
        this.setState({showBookDetail: false, showBooksList: true});
    }

	addToCart = (book) => {
		let alreadyInCart = null;
		if(this.state.itemsList) {
			alreadyInCart = this.state.itemsList.filter(cartBook => Number(cartBook.book_id) === Number(book.id));
		}
		if (alreadyInCart && alreadyInCart.length > 0) {
			let quantity = Number(alreadyInCart[0].quantity);
			quantity += 1;
			let cartId = alreadyInCart[0].id;
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": quantity}
			let updateCart = Service.updateQuantityToCartRequest(data)
			this.setState({ redirectToCart: updateCart })

		} else {
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": 1, "price": book.price }
			let addedToCart = Service.addToCartRequest(data)
			this.setState({ redirectToCart: addedToCart })
		}
		
	}

	handleInputChange = (event) => {
		this.setState({
			query: event.target.value
		})
	}

	keywordSearch = () => {
		this.setState({ showAdvanceSearch: false })
		let keyword = this.state.query
		let books = Service.keywordSearchRequest(keyword)
		this.setState({ booksList: books })
	}



	categoryClickEvent = (category) => {
		let books = Service.filterBooksByCategory(category.name)
		this.setState({ booksList: books })
	}

	authorClickEvent = (author) => {
		let books = Service.filterBooksByAuthor(author.name)
		this.setState({ booksList: books })
	}



	toAdvanceSearch = () => {
		this.setState({ showAdvanceSearch: true, showLeftMenu: false })
	}

	searchHandler = (booksList) => {

		console.log('HI I AM HERE!!!!', booksList)

		this.setState({ showLeftMenu: true, showAdvanceSearch: false })
	}

	renderBookCategories = (row) => {
		return (
			<ul className="list-categories" >
				{this.state.bookCategories.map(function (cat, index) {
					return <li key={index} onClick={() => this.categoryClickEvent(cat)}>{cat.name}</li>;
				}, this)}
			</ul>
		)
	}

	renderAuthors = () => {
		return (
			<ul className="list-categories" >
				{this.state.authorsList.map(function (author, index) {
					return <li key={index} onClick={() => this.authorClickEvent(author)}>{author.name}</li>;
				}, this)}
			</ul>
		)
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
				<div className="page-container-layout home-page">
					<div className='container-top-header'>
						<div className="logo-container"> <img className='logo' src='../../assets/logo.png' alt='Talent Manager' />
							
						</div>
						<div className="buttons-container">
							<div className="form-group">
								<input className="form-control" placeholder="Keyword Search for books by Title / Bppk Category / Author Name" onChange={this.handleInputChange} />
							</div>

							<button type="button" className="btn btn-primary btn-info search" onClick={this.keywordSearch}>
								Search
								</button>

							<button type="button" className="btn btn-primary advanced-search" onClick={this.toAdvanceSearch}>
								<i className="fa fa-cog"></i> Advanced Search
								</button>
						</div>
					</div>
					<div className="container-drop-down-menu left-gap">
						<span className="drop-dwon">Shop By Category
								<span className="fa fa-chevron-down"> </span>
							<span className="fa fa-chevron-up"> </span>
							<div className="container-categories">
								<div className="column-left">
									<div className="top-categories">Top Categories</div>
									{this.state.bookCategories.length > 0 ? this.renderBookCategories() : null}
								</div>
								<div className="column-middle">
									<div className="top-authors">Top Authors</div>
									{this.state.bookCategories.length > 0 ? this.renderAuthors() : null}
								</div>

							</div>
						</span>
						<span className="top-sellers">Top Sellers</span>
						<span className="coming-soon">Coming Soon</span>
						<span className="highlights">Highlights</span>
						<span className="bargain">Bargain Shop</span>
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
									{this.state.showBookDetail && <BookDetail bookDetail={this.state.bookDetail} onClick={this.changeHandler}></BookDetail> }
								</div>
							</div>
						</div>
					</div>
				</div>
				

				{this.state.redirectToCart && <Redirect to="/cart" />}
			</Layout>

		)
	}
}



