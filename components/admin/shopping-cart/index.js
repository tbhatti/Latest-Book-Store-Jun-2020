import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../../containers/page-layout'
import store from '../../../store'
import StarRatings from 'react-star-ratings';
import Storage from '../../../local-storage';
import Modal from '../../modal/modal';
import Service from '../../../api-service';
import $ from 'jquery';

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
            let data = Service.getCartItems(id);
            var booksIDs = [];
                if(data[0]['error']) {
                    this.setState({showError: true});
                    this.setState({itemsList: []});// If error it means there is no item in array
                } else {
                    data.map((item) => {booksIDs.push(item.book_id);});
                    this.getBooksList(booksIDs);
                    this.setState({itemsList: data, bookIds: booksIDs}); 
                }
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
        Service.removeCartItem(id, this.state.userProfile["id"])
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

        let itemsList = [...this.state.itemsList];
        itemsList[index] = {...itemsList[index], quantity: input[0].value};
        this.setState({ itemsList });
    }

    goToBookDetail = (row) => {
        console.log('====Here is your rwo data======', row);
        this.setState({bookID: row.book_id, detailsRedirect: true});
        
    }

    renderRows = () => {
		return this.state.booksList && this.state.booksList.length > 0 ?  this.state.itemsList.map((row, index) => { 
            this.test = row.quantity;
            
            const result = this.state.booksList.filter(book =>book.id === Number(row.book_id));             
            let coverImage =  result[0].cover_image;
            let book =  result[0];
           
            let imageSource = '../../assets/books/'+coverImage
			return <span  key={book.id + imageSource}><div className="row" key={book.id + imageSource}>
                
            <div className="col-12 col-sm-12 col-md-2 text-center" onClick={() => this.goToBookDetail(row)}>
                    <img  data-toggle="tooltip" data-placement="top" data-original-title={book.title} className=" tooltip-main img-responsive small-image" src={imageSource} alt="prewiew"/>
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
                        <input value={this.test} onChange={(event)=>{this.handleQuantityChange(event, row, index)}}  type="number" step="1" max="99" min="1" title="Quantity" className="qty"
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
            <Layout selectedTab="cart" ref='layOut'>
                <div className="main-shopping-cart-page">
               
                    <div className='page-header'>					
                        <h4><strong>Your Cart</strong></h4>
                        <a href="" className="btn-outline-info btn-sm pull-right" onClick={this.gotoHome}>Continiu shopping</a>
                    </div> 
                    <div className="cotainer-shopping-cart">
                    {showModal ? (<Modal handleModalCloseClick={this.handleModalCloseClick} handleConfirmClick={(event)=>{this.handleConfirmClick()}}/>) : null}
                        <div className="container">
                            <div className="card shopping-cart">
                                <div className="card-header bg-dark text-light">
                                
                                
                                    <div className="clearfix"></div>
                                </div>
                                <div className="card-body">
                                
                                {this.renderRows()}

               
                    {/* <a href="" className="btn btn-outline-secondary pull-right">
                        Update shopping cart
                    </a> */}
                
                {this.state.showError ? <div className="alert alert-danger alert-block">
                    <button className="close" data-dismiss="alert">&times;</button>
                        <span><a href="/home" className="alert-link"></a></span>
                </div>
                : <span className="pull-right"><div className=""> <span className="">{}</span>                 
                        </div>
                       
                        <div className="total-amount"><span className="estimated-ship"></span>
                        </div>
                       
                        <div className="total-amount font-weight-bold"> <span className="total-price"></span>
                        </div>

                        <button type="button" className="btn btn-success">
                             <span className="fa fa-play"></span>
                        </button>
                        
                    </span>}
            </div>                         
                            </div>
                        </div>
                        
                    </div>
                    <div className="page-footer">
                    {this.state.showError ? <div className="alert alert-danger alert-block">
                    <button className="close" data-dismiss="alert">&times;</button>
                        <span>There is no item in the cart <a href="/home" className="alert-link">Continue Shopping</a></span>
                </div>
                : <span className="pull-right"><div className="total-amount">Subtotal: <span className="sub-total">{total}</span>                 
                        </div>
                       
                        <div className="total-amount">Estimated shipping <span className="estimated-ship">8</span>
                        </div>
                       
                        <div className="total-amount font-weight-bold">Total <span className="total-price">{total + 8}</span>
                            <button type="button" className="btn btn-danger">
                                Checkout <span className="fa fa-play"></span>
                            </button>
                        </div>

                       
                        
                    </span>}
                    </div>             
                </div>
               
                {this.state.detailsRedirect && <Redirect to={`/books/${this.state.bookID}`} />}
                {this.state.redirectToHome && <Redirect to="/home" />}
            </Layout>
                

        )
	}
}

ShoppingCart.propTypes = {
    //bookID: React.PropTypes.string
}
