import assign from 'object-assign'
import {EventEmitter} from 'events'
import $ from 'jquery';

const BooksService = assign({}, EventEmitter.prototype, {
    categoriesList: [],
    booksList: [],
    itemsInCart: [],
    addedToCart: false,
    updateQuantityToCart: false,
    bookDetail: [],
    publishersList: [],
    insertedSuccessfully: false,
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

    getPublishersListRequest () {
		$.ajax({  
			type: "GET",  
			url: "http://localhost:5000/publishers-list",  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => { 
                this.publishersList = data
			},
			error: ()=> { } 
		});
        return this.publishersList
    },
    
    addToCartRequest (cartData) { 
		$.ajax({  
			type: "POST",  
			url: "http://localhost:5000/add-to-cart",  
		    data: JSON.stringify(cartData),  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => {
                this.addedToCart = true;
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
                this.updateQuantityToCart = true;
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

    getCartItems (customerId) {
		$.ajax({  
            type: "POST",  
            url: "http://localhost:5000/get-cart-details",  
            data: JSON.stringify({"customer_id": customerId}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            async: false,
            success: (data) => {                   
               this.itemsInCart = data;
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        });
        return this.itemsInCart;
    },
    removeCartItem  (id, userId)  {
        $.ajax({   
            type: "DELETE",  
            url: "http://localhost:5000/delete-cart-item",  
            data: JSON.stringify({"cart_id": id}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            async: false,
            success: (data) => {            
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        });
    },
    getBookDetail (bookID) {
        $.ajax({  
			type: "POST",  
			url: "http://localhost:5000/book-details",  
		    data: JSON.stringify({"bookID": bookID}),  
			contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
			success: (data) => {
                this.bookDetail = data;
              
                
			},
			error: ()=> {
				console.log('User does not exist')

			  } 
        });
        return this.bookDetail;	
    },
    filterAuthorWithBookCategory (category) {
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/filter-authors",
            data: JSON.stringify({ "genre": category }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: (data) => {
                this.authorsList = data;
                
            },
            error: () => { console.log('Authors with the given Genre does not exit') }
        });
        return this.authorsList;
    },
    insertBook (book) {
        $.ajax({
            type: "POST",
            url: "http://localhost:5000/new-book",
            data: JSON.stringify({ "publisher": book.publisher, "book_dimension": book.book_dimension, "book_format": book.book_format, "price": book.price, "title": book.title, "publish_date": book.publish_date, "book_category": book.book_category, "author_name": book.author_name }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: (dataString) => {
                this.insertedSuccessfully = true;
            },
            error: () => {
                console.log('ERRROR DONE____!')

            }
        });
        return this.insertedSuccessfully;
    },
    updateBook (book) {
        $.ajax({  
            type: "POST",  
            url: "http://localhost:5000/update-book",  
            data: JSON.stringify({"id": book.id, "publisher": book.publisher, "book_dimension": book.book_dimension, "book_format": book.book_format, "price": book.price, "title": book.title,  "publish_date": book.publish_date, "book_category": book.book_category, "author_name": book.author_name}),  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: (dataString) => {  
                this.insertedSuccessfully = true;
            },
            error: ()=> {
                console.log('ERRROR DONE____!')

              } 
        });
        return this.insertedSuccessfully;
    },
	emitChange () {
		this.emit('change')
	}
})

export default BooksService
