import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../../containers/page-layout'
import Suggestions from './suggestion'
import $ from 'jquery';
import NewBook from './new.js';
import BookDetail from './view';


export default class Books extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            redirect: false,
            booksList: [],
            authorsList: [],
			bookCategories: [],
			selectedBookCategory: '',
            selectedAuthor: '',
            query: '',
            results: [],
            language: '',
            showSuggestions: false,
            spreadSheet:[],
            detailsRedirect: false,
            bookID: '',
            showBooksList: true,
           showNewBook: false,
           showBookDetail: false
		}
		
    }
    
    componentDidMount = () => {
        
        $.ajax({  
			type: "GET",  
			url: "http://localhost:5000/books-list",  
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (data) => { 
				this.setState({booksList: data});
			},
			error: ()=> { } 
        });
        
        // $.ajax({  
		// 	type: "GET",  
		// 	url: "http://localhost:5000/books-categories-list",  
		// 	contentType: "application/json; charset=utf-8",    
		// 	dataType: "json",
		// 	success: (data) => { 
		// 		this.setState({bookCategories: data, selectedBookCategory: data[0].name });
		// 	},
		// 	error: ()=> { } 
        // });
        
        $.ajax({  
			type: "GET",  
			url: "http://localhost:5000/authors-list",  
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (data) => { 
				this.setState({authorsList: data, selectedAuthor: data[0].name});
			},
			error: ()=> { } 
		});
       
    }

    onChangeBooksCategory = (event) => {
		this.setState({selectedBookCategory: event.target.value})
		let genre = event.target.value
		$.ajax({  
			type: "POST",  
			url: "http://localhost:5000/filter-authors",  
			data: JSON.stringify({"genre": genre}),  
			contentType: "application/json; charset=utf-8",    
			dataType: "json",
			success: (data) => { 
				this.setState({authorsList: data});
			},
			error: ()=> { console.log('Authors with the given Genre does not exit') } 
        });
	
	}

	onChangeAuthor = (event) => {
		this.setState({selectedAuthor: event.target.value})
	}

    rowClickEvent = (row) => {
        console.log('Details', row)
        this.setState({showBookDetail: true, showBooksList: false, bookID: row.id, bookDetail: row})
	}

	renderRows = () => {
        return this.state.booksList.length > 0 ? 
        this.state.booksList.map((row) => {
          
            let imageSource = '../../assets/books/'+row.cover_image;
			return <tr onClick={() => this.rowClickEvent(row)} key={row.id}>
				<td>{row.id}</td>
				<td>{row.title}</td>
                <td>{row.author_name}</td>
                <td>{row.book_category}</td>  
				<td>{row.publish_date}</td>  
                <td><img className="small-image" src={imageSource} /></td>
			
			</tr>
		}) : null 

    }
    
    onClickNewCategory = () => {
        this.setState({showNewBook: true, showBooksList: false})
    }


    filterBooks = () => {
        $.ajax({  
			type: "POST",  
			url: "http://localhost:5000/filter-books",  
			data: JSON.stringify({"book_category": this.state.selectedBookCategory, "author_name":this.state.selectedAuthor}),  
			contentType: "application/json; charset=utf-8",    
			dataType: "json",
			success: (data) => { 
                data.length > 0 ? this.setState({error: ''}) : this.setState({error: 'Authors with the given Book Category does not exit'})
                this.setState({booksList: data});
                //console.log('Authors with the given Genre does not exit', filter-books)
			},
			error: ()=> {  console.log('whatttttttttt')} 
        });
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

    changeHandler = (value) => {
        this.setState({showBooksList: value, showNewBook: false
        });
    }

	render () {
      
		return (
            <div className="main-books-page">
            {this.state.showBooksList &&  <div className="page-container-layout">
                    <div className="page-header">					
                        <h5>Books</h5>
                    </div>  
        
                    <div className="search-buttons-container">
                        <div className="input-group mb-3">
                            <button className="btn btn-primary pull-right" onClick={this.onClickNewCategory}><i className="fa fa-book"></i> Add Book</button>
                            <input type="text" className="form-control" placeholder="Search for books by Title / Author / Category" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-info"><i className="fa fa-search"></i></button>
                            </div>
                        </div>   
                    </div>

                    <div className="container-table">
                        <div className="row">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Author Name</th>
                                    <th scope="col">Book Category</th>
                                    <th scope="col">Published Date</th>
                                    <th scope="col">Book Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderRows()}
                                </tbody>
                            </table>
                    </div>
                </div>
                {this.state.redirect && <Redirect to="/new-book" />}
                {this.state.detailsRedirect && <Redirect to={`/book-detail/${this.state.bookID}`} />}

                
                </div>
        }
        {this.state.showNewBook && <NewBook onClick={this.changeHandler}></NewBook> }
        {this.state.showBookDetail && <BookDetail bookDetail={this.state.bookDetail}></BookDetail> }
    </div>  
   
          

        )
	}
}

Books.propTypes = {
    /** Props will go here */
}

