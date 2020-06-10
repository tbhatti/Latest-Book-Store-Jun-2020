import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import App from './containers/App';
import PageLayout from './containers/page-layout';
import SignUp from './components/register/register.js';
import UserDetails from './components/user-details/user-details.js';
import Admin from './components/admin/home/admin-home.js';
import AdminBooksList from './components/admin/books/index.js';

import Home from './components/home/home.js';
import ShoppingCart from './components/admin/shopping-cart';
import Contact from './components/contact/contact';
import BookDetail from './components/admin/books/view';
import NewBook from './components/admin/books/new';
import EditBook from './components/admin/books/edit';




export default () => {
	return (
		<BrowserRouter>
			<Switch>
				
			  <Route exact path='/' component={App}/>			  
				<Route path='/home' component={Home}/>
				<Route path='/admin' component={Admin}/>
				<Route path='/register' component={SignUp}/>
				<Route path='/user-details/:id' component={UserDetails} />
				<Route path='/admin-books' component={AdminBooksList}/>
				<Route path='/cart' component={ShoppingCart} />
				<Route path='/contact' component={Contact} />

				<Route path='/books/:id' component={BookDetail} />
				<Route path='/book/new' component={NewBook} />
				<Route path='/book/edit/:id' component={EditBook} />

			

}}/>
			</Switch>
		</BrowserRouter>
	)
}
