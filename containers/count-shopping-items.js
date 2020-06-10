import React from 'react';
import Service from '../api-service';
import Storage from '../local-storage';
import  { Redirect } from 'react-router-dom';

export default class CountShoppingItems extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            booksCount: 0,
            redirectToCart: false
		}
	}

	componentDidMount = () => {		
		let userProfile = Storage.getUserProfile();	
        this.getCartDetails(userProfile["id"]);
    }


	getCartDetails = (id) => {
        let data = Service.getCartItems(id);
            if(data[0]['error']) {
                this.setState({booksCount: 0});// If error it means there is no item in array
            } else {
                this.setState({booksCount: data.length}); 
            }
    }

    goToCart = () => {
        this.setState({redirectToCart: true});
    }

	render() {
		return (
            <div className="shopping-cart" onClick={this.goToCart}>
                <i className="fa fa-shopping-cart icon-cart" >
                    <span className="label-cart"> My Shopping Cart</span>
                </i>
                <div className="circleBase type3">{this.state.booksCount}
                </div>
                {this.state.redirectToCart && <Redirect to={`/cart`} />}
        </div>
		)
	}
}



