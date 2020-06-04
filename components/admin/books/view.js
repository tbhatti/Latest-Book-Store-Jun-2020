import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../../containers/page-layout'
import ReactImageMagnify from 'react-image-magnify';
import StarRatings from 'react-star-ratings';
import store from '../../../store'
import Service from '../../../api-service';
import Storage from '../../../local-storage';



export default class BookDetails extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            redirect: false,
            bookDetail: this.props.bookDetail,
            rating: 0,
            quantity: 0,
            redirectToCart: false,
            userProfile: {},
            itemsList: []
		}
        this.data = {}
        this.loggedInUser = {}
        this.bookDetail = {}
        console.log('this.props.bookDetailthis.props.bookDetail', this.state.bookDetail);
    }
    
    componentDidMount = () => {
        let userProfile = Storage.getUserProfile();
        this.setState({userProfile: userProfile});
        this.getCartDetails(userProfile["id"]);
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

    changeRating = ( newRating, name ) => {
        this.setState({
          rating: newRating
        });
      }

    addToCart = () => {
        let book = this.state.bookDetail;
        let alreadyInCart = null;
		if(this.state.itemsList) {
			alreadyInCart = this.state.itemsList.filter(cartBook => Number(cartBook.book_id) === Number(book.id));
		}
		if (alreadyInCart && alreadyInCart.length > 0) {
			let quantity = Number(alreadyInCart[0].quantity);
			quantity += Number(this.state.quantity);
			let cartId = alreadyInCart[0].id;
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": quantity}
			let updateCart = Service.updateQuantityToCartRequest(data)
			this.setState({ redirectToCart: updateCart })

		} else {
			let data = { "customer_id": this.state.userProfile.id, "book_id": book.id, "quantity": 1, "price": book.price }
			let addedToCart = Service.addToCartRequest(data)
			this.setState({ redirectToCart: addedToCart })
		}


        // let data = {"customer_id": this.state.userProfile.id, "book_id": this.state.bookDetail.id, "quantity": this.state.quantity, "price": this.state.bookDetail.price};
        // let addedToCart = Service.addToCartRequest(data)
		// this.setState({ redirectToCart: addedToCart })
    }

    onQuantityChange = (event) =>{
        this.setState({quantity: Number(event.target.value)})
    }

    changeHandler = () => {
        if (typeof this.props.onClick === 'function') {
            this.props.onClick(true);
        }
    }

	render () {
        let imageSource = '../../assets/books/'+this.state.bookDetail.cover_image;
        
		return (
            <div >
                <div className="page-container-layout">
                <div className='page-header'>					
					<h5>Detail</h5>
				</div>

                    
                {this.state.redirect && <Redirect to="/new-author" />}
                <div className="cotainer-details">
                    <div className="container-left-image">
                        <div className="container-book-title"> <span className="title">{this.state.bookDetail.book_category}</span></div>                       
                        <div className="container-book-image"> <span className="image">
                                <div className="perimeter">
                                    <div className="image">
                                    <ReactImageMagnify {...{
                                        smallImage: {
                                        alt: 'Wristwatch by Ted Baker London',
                                        isFluidWidth: false,
                                        src: `${imageSource}`,
                                        srcSet: this.srcSet,
                                        width: 250,
                                        height: 330,
                                        sizes: '(min-width: 800px) 33.5vw, (min-width: 415px) 50vw, 100vw',
                                        },
                                        largeImage: {
                                        alt: '',
                                        src: `${imageSource}`,
                                        width: 400,
                                        height: 600
                                        },
                                        isHintEnabled: true
                                    }}/>
                                    </div>
                
            </div></span></div>  
                    </div>
                    <div className="container-right-details">
                        <div className="container-left">
                            <div className="book-title">{this.state.bookDetail.title}</div>                       
                            <div className="author-name">{this.state.bookDetail.author_name}</div>
                            <div className="book-category"><span>Book Category: </span><span >{this.state.bookDetail.book_category}</span></div>
                            <div  className="published-date"><span>Published Date: </span><span>{this.state.bookDetail.publish_date}</span></div>  
                            <div  className="book-price"><span>Our Price: </span><span>¥ {this.state.bookDetail.price}</span></div>
                            <div className="ratings">
                                <StarRatings
                                    rating={this.state.rating}
                                    starRatedColor="orange"
                                    changeRating={this.changeRating}
                                    numberOfStars={5}
                                    name='rating'
                                    starDimension="30px"
                                    starSpacing="5px"/>
                            </div>
                            <div  className="number-of-reviews"><span>{this.state.bookDetail.reviews} Reviews</span></div>  
                            <fieldset className="cart-container" >
                                <div className="form-group">
                                    <label>Select Quantity</label>
                                    <input type="number" id="height"  className="form-control" name="height" placeholder="Select Quantity" step="1" onChange={this.onQuantityChange}/>
                                </div>
                                
                            </fieldset> 
                        </div>
                        <div className="container-right">
                            <div className="book-info"><span>Book Format: </span><span >{this.state.bookDetail.book_format}</span></div>
                            <div  className="book-info"><span>Dimensions: </span><span>{this.state.bookDetail.book_dimension}</span></div>  
                            <div  className="book-info"><span>Publisher: </span><span>{this.state.bookDetail.publisher}</span></div>
                            
                            
                            <label className="book-info">
                            Lorem ipsum is a pseudo-Latin text used in web design, typography, layout, and printing in place of English to emphasise design elements over content. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin text by the classical author and philosopher Cicero. Its words and letters have been changed by addition or removal, so to deliberately render its content nonsensical; it's not genuine, correct, or comprehensible Latin anymore. While lorem ipsum's still resembles classical Latin, it actually has no meaning whatsoever. As Cicero's text doesn't contain the letters K, W, or Z, alien to latin, these, and others are often inserted randomly to mimic the typographic appearence of European languages, as are digraphs not to be found in the original.
                            .</label>
                        </div>
                            <div className="row">
                                <div className="col-sm-12 text-center">
                                    <button className="btn btn-danger">
                                        <i className="fa fa-shopping-cart" onClick={this.addToCart}></i> Add to Cart
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={this.changeHandler}>Cancel</button>                 
                                </div>
                            </div>   
                    </div>
                    
                </div> 
                              
                </div>

               
                {this.state.redirectToCart && <Redirect to="/cart" />}

              
            </div>

        )
	}
}

BookDetails.propTypes = {
    bookDetail: React.PropTypes.object,
    value: React.PropTypes.bool,
    onClick: React.PropTypes.func
}

