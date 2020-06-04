import assign from 'object-assign'
import {EventEmitter} from 'events'
import $ from 'jquery';

const BooksService = assign({}, EventEmitter.prototype, {
    categoriesList: [],
    booksList: [],
    addedToCart: false,
    updateQuantityToCart: false,
	loginRequest (data) {
        let result 
		$.ajax({  
            type: "POST",  
            url: "http://localhost:5000/login",  
            data: JSON.stringify({"email": this.state.username, "password": this.state.password}),  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (userArray) => { 
                this.setState({errorMessage: '', showError: false, redirect: true});
                result = userArray[0]
            },
            error: ()=> {
                this.setState({errorMessage: 'User with the given username does not exit', showError: true});

              } 
        });
        return {errorMessage: '', result}
    },
    getCategoriesListRequest () {
		$.ajax({  
			type: "GET",  
			url: "http://localhost:5000/books-categories-list",  
			contentType: "application/json; charset=utf-8",    
            dataType: "json",
            async: false,
			success: (data) => { 
                this.categoriesList = data
               
			},
			error: ()=> { } 
        });
        return this.categoriesList
    },
    getBooksListRequest () {
		$.ajax({  
			type: "GET",  
			url: "http://localhost:5000/books-list",  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => { 
                this.booksList = data
			},
			error: ()=> { } 
		});
        return this.booksList
    },
    getAuthorsListRequest () {
		$.ajax({  
			type: "GET",  
			url: "http://localhost:5000/authors-list",  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => { 
                this.booksList = data
			},
			error: ()=> { } 
		});
        return this.booksList
    },
    
    addToCartRequest (data) {
		$.ajax({  
			type: "POST",  
			url: "http://localhost:5000/add-to-cart",  
		    data: JSON.stringify(data),  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => {
                this.addedToCart = true
			},
			error: ()=> {
				console.log('User does not exist')

			  } 
        });
        return this.addedToCart
    },
    updateQuantityToCartRequest (data) {
		$.ajax({  
			type: "POST",  
			url: "http://localhost:5000/update-quantity-to-cart",  
		    data: JSON.stringify(data),  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => {
                this.updateQuantityToCart = true
			},
			error: ()=> {
				console.log('User does not exist')

			  } 
        });
        return this.updateQuantityToCart
    },
    keywordSearchRequest (keyword) {
		$.ajax({  
			type: "POST",  
            url: "http://localhost:5000/search", 
            data: JSON.stringify({"keyword": keyword}), 
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => { 
				this.booksList = data
			},
			error: ()=> { } 
        });
        return this.booksList
    },
    filterBooksByCategory (categoryName) {
		$.ajax({  
            type: "POST",  
            url: "http://localhost:5000/filters-books-by-categories", 
            data: JSON.stringify({"category": categoryName}), 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: (data) => { 
                this.booksList = data
            },
            error: ()=> { } 
        });
        return this.booksList
    },
    filterBooksByAuthor (authorName) {
		$.ajax({  
            type: "POST",  
            url: "http://localhost:5000/filters-books-by-authors", 
            data: JSON.stringify({"aothor": authorName}), 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: (data) => { 
                this.booksList = data
            },
            error: ()=> { } 
        });
        return this.booksList
    },
    contactUsRequest (data) {
		$.ajax({  
			type: "POST",  
			url: "http://localhost:5000/contact-us",  
		    data: JSON.stringify(data),  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => {
                this.emailSent = true
			},
			error: ()=> {
				console.log('User does not exist')

			  } 
        });
        return this.emailSent
    },
	emitChange () {
		this.emit('change')
	}
})

export default BooksService
