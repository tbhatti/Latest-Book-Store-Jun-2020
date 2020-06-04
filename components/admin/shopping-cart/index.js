import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../../containers/page-layout'
import store from '../../../store'
import StarRatings from 'react-star-ratings';
import Storage from '../../../local-storage';
import Modal from '../../modal/modal';

export default class ShoppingCart extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            redirect: false,
            itemsList: [],
            bookIds: [],
            userProfile: {},
            booksList: [],
            detailsRedirect: false,
            bookID: '',
            showError: false,
            quantity: 0,
            showModal: false,
            selectedCartItem: {},
            redirectToHome: false
		}
    }
    
    componentDidMount = () => {
        let userProfile = Storage.getUserProfile();
        if(userProfile) {
            this.setState({userProfile: userProfile});
            this.getCartDetails(userProfile["id"]);
        } else {
            this.setState({showError: true});
        }
    }

    handleModalShowClick = (row) => {
        //e.preventDefault();
        this.setState({
          showModal: true, selectedCartItem: row
        })
      }
    
      handleModalCloseClick = () => {
        this.setState({
          showModal: false
        })
      }

      handleConfirmClick = () => {
        this.onRemoveItem(this.state.selectedCartItem.id)
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
                    var booksIDs = [];
                    if(data[0]['error']) {
                        this.setState({showError: true});
                        this.setState({itemsList: []});// If error it means there is no item in array
                    } else {
                    data.map((item) => {  
                        booksIDs.push(item.book_id);
                       
                    });
                        this.getBooksList(booksIDs);
                        this.setState({itemsList: data, bookIds: booksIDs}); 
                    
                }
                               
                },
                error: ()=> { console.log('There is no item in your shoping cart'); } 
            });
        } else {
            this.setState({showError: true})
       }
       
    }

    getBooksList = (ids) => {
        $.ajax({  
            type: "POST",  
            url: "http://localhost:5000/books-in-cart",  
            data: JSON.stringify({"book_ids": ids.toString()}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            success: (data) => { 
                this.setState({booksList: data});
              
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        }); 
    }

    getImageURL = (bookId) => {
        
        
    }

    onRemoveItem = (id) => {
        $.ajax({  
            type: "DELETE",  
            url: "http://localhost:5000/delete-cart-item",  
            data: JSON.stringify({"cart_id": id}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            success: (data) => {
               this.getCartDetails(this.state.userProfile["id"]);            
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        });
    }

    rowClickEvent = (row) => {
        this.setState({detailsRedirect: true, bookID: row.book_id})
	}
    
    renderButton = (id) => {        
        return <i className="fa fa-trash" onClick={()=>{this.onRemoveItem(id)}}></i>
    }

    
    handleQuantityChange = (event, row, index ) => {
        let itemsList = [...this.state.itemsList];
        itemsList[index] = {...itemsList[index], quantity: event.currentTarget.value};
        this.setState({ itemsList });       
    }

    updateQuantity = (e, row, index) => {
        const isNegative = $(e.target).closest('.minus').is('.minus');
        const input = $(e.target).closest('.quantity').find('input');
        
        if (input.is('input')) {
            input[0][isNegative ? 'stepDown' : 'stepUp']()
        }
        console.log('000000000000000000000', input[0].value);

        let itemsList = [...this.state.itemsList];
        itemsList[index] = {...itemsList[index], quantity: input[0].value};
        this.setState({ itemsList });
    }

    renderRows = () => {
		return this.state.booksList && this.state.booksList.length > 0 ?  this.state.itemsList.map((row, index) => { 
            this.test = row.quantity;
           
            const result = this.state.booksList.filter(book =>book.id === Number(row.book_id));             
            let coverImage =  result[0].cover_image;
            let book =  result[0];
           
            let imageSource = '../../assets/books/'+coverImage
			return <span  key={book.id + imageSource}><div className="row" key={book.id + imageSource}>
                
            <div className="col-12 col-sm-12 col-md-2 text-center">
                    <img className="img-responsive small-image" src={imageSource} alt="prewiew"/>
            </div>
            <div className="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                <h5 className="product-name"><strong>{book.title}</strong></h5>
                <h5>
                    <small>{book.book_category}</small>
                </h5>
            </div>
            <div className="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                <div className="col-3 col-sm-3 col-md-3 text-md-right">
                    <h6><strong>$ {book.price} <span className="text-muted">x</span></strong></h6>
                </div>
                <div className="col-4 col-sm-4 col-md-3">
                    <div className="quantity">
                        <button value="+" className="plus" onClick={(event)=>{this.updateQuantity(event, row, index)}}>
                            <i className="fa fa-plus"></i>
                        </button>
                        <input value={this.test} onChange={(event)=>{this.handleQuantityChange(event, row, index)}}  type="number" step="1" max="99" min="1" title="Qty" className="qty"
                               size="4"/>
                        <button value="-" className="minus" onClick={(event)=>{this.updateQuantity(event, row, index)}}>
                            <i className="fa fa-minus"></i>
                        </button>
                    </div>
                </div>
                <div className="col-4 col-sm-4 col-md-3">
                <h6><strong>$ {Number(row.price)*Number(row.quantity)} <span className="text-muted"></span></strong></h6>
                </div>
                <div className="col-2 col-sm-2 col-md-2 text-right">
                    <button type="button" className="btn btn-outline-danger btn-xs" onClick={(event)=>{this.handleModalShowClick(row)}}>
                        <i className="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div><hr></hr>
        </span>
		}) : null
      
    }

    gotoHome = () => {
        this.setState({redirectToHome: true});
    }
   
	render () {
        const { showModal } = this.state;
        let total = 0;
       
            this.state.itemsList.map((row) => { 
                total += Number(row.price)*Number(row.quantity);
            });
        
		return (
            <Layout selectedTab="books" ref='layOut'>
                <div className="main-shopping-cart-page">
               
                    <div className='page-header'>					
                        <h4><strong>Your Cart</strong></h4>
                    </div> 
                    <div className="cotainer-shopping-cart">
                    {showModal ? (<Modal handleModalCloseClick={this.handleModalCloseClick} handleConfirmClick={(event)=>{this.handleConfirmClick()}}/>) : null}
                        <div className="container">
                            <div className="card shopping-cart">
                                <div className="card-header bg-dark text-light">
                                
                                <a href="" className="btn btn-outline-info btn-sm pull-right" onClick={this.gotoHome}>Continiu shopping</a>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="card-body">
                                
                                {this.renderRows()}

               
                    {/* <a href="" className="btn btn-outline-secondary pull-right">
                        Update shopping cart
                    </a> */}
                
                {this.state.showError ? <div className="alert alert-danger alert-block">
                    <button className="close" data-dismiss="alert">&times;</button>
                        <span>There is no item in the cart <a href="/home" className="alert-link">Continue Shopping</a></span>
                </div>
                : <span className="pull-right"><div className="total-amount">Subtotal: <span className="sub-total">{total}</span>                 
                        </div>
                       
                        <div className="total-amount">Estimated shipping <span className="estimated-ship">8</span>
                        </div>
                       
                        <div className="total-amount font-weight-bold">Total <span className="total-price">{total + 8}</span>
                        </div>

                        <button type="button" className="btn btn-success">
                            Checkout <span className="fa fa-play"></span>
                        </button>
                        
                    </span>}
            </div>                         
                            </div>
                        </div>
                        
                    </div>
                                
                </div>
                {this.state.detailsRedirect && <Redirect to={`/book-detail/${this.state.bookID}`} />}
                {this.state.redirectToHome && <Redirect to="/home" />}
            </Layout>
                

        )
	}
}

ShoppingCart.propTypes = {
    //bookID: React.PropTypes.string
}
