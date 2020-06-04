import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../../containers/page-layout'
import Suggestions from './suggestion'
import $ from 'jquery';
import NewBook from './new.js';
import BookDetail from './view'; 
import Modal from '../../modal/modal';
import EditBook from './edit';
import Service from '../../../api-service';


export default class Books extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
           
            authorsList: [],
			bookCategories: [],
			selectedBookCategory: '',
            selectedAuthor: '',
            query: '',
            results: [],
            language: '',
            showSuggestions: false,
            spreadSheet:[],
            bookID: '',
            showBooksList: true,
           showNewBook: false,
           showEditBook: false,
           showBookDetail: false,
           selectedBook: {},
           showModal: false,
           /**Pagination */
           booksList: [],
           currentPage: 1,
           booksPerPage: 4,
            upperPageBound: 4,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 4
           
		}
		
    }
    
    componentDidMount = () => {
        $("ul li.active").removeClass('active');
        $('ul li#'+this.state.currentPage).addClass('active');
        this.getBooksList();        
       
    }

    keywordSearch = () => {
        console.log(this.state.query);
		let keyword = this.state.query
		let books = Service.keywordSearchRequest(keyword)
		this.setState({ booksList: books })
	}

    handleClick = (event) => {
        let listid = Number(event.target.id);
        this.setState({
          currentPage: listid
        });
        $("ul li.active").removeClass('active');
        $('ul li#'+listid).addClass('active');
        this.setPrevAndNextBtnClass(listid);
      }
      setPrevAndNextBtnClass = (listid)=> {
        let totalPage = Math.ceil(this.state.booksList.length / this.state.booksPerPage);
        this.setState({isNextBtnActive: 'disabled'});
        this.setState({isPrevBtnActive: 'disabled'});
        if(totalPage === listid && totalPage > 1){
            this.setState({isPrevBtnActive: ''});
        }
        else if(listid === 1 && totalPage > 1){
            this.setState({isNextBtnActive: ''});
        }
        else if(totalPage > 1){
            this.setState({isNextBtnActive: ''});
            this.setState({isPrevBtnActive: ''});
        }
    }
      btnIncrementClick =() => {
          this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
          this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
          let listid = this.state.upperPageBound + 1;
          this.setState({ currentPage: listid});
          this.setPrevAndNextBtnClass(listid);
    }
      btnDecrementClick = () => {
        this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
        this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid});
        this.setPrevAndNextBtnClass(listid);
    }
    btnPrevClick = () => {
        if((this.state.currentPage -1)%this.state.pageBound === 0 ){
            this.setState({upperPageBound: this.state.upperPageBound - this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound - this.state.pageBound});
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
    }
    btnNextClick = () => {
        if((this.state.currentPage +1) > this.state.upperPageBound ){
            this.setState({upperPageBound: this.state.upperPageBound + this.state.pageBound});
            this.setState({lowerPageBound: this.state.lowerPageBound + this.state.pageBound});
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage : listid});
        this.setPrevAndNextBtnClass(listid);
    }

    getBooksList = () => {
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

    onEditItem = (row) => {
      
        this.setState({showNewBook: false, showBooksList: false, showEditBook: true, bookDetail: row});
        console.log('------------------------------------------------------',this.state.bookDetail);
    }

    handleModalShowClick = (row) => {
        this.setState({
          showModal: true, selectedBook: row
        })
      }
    
      handleModalCloseClick = () => {
        this.setState({
          showModal: false
        })
      }

      handleConfirmClick = () => {
        this.deleteBook(this.state.selectedBook.id)
      }

      deleteBook = (id) => {
        $.ajax({  
            type: "DELETE",  
            url: "http://localhost:5000/delete-book",  
            data: JSON.stringify({"id": id}),  
            contentType: "application/json; charset=utf-8",    
            dataType: "json",
            success: (data) => {
               this.getBooksList();            
            },
            error: ()=> { console.log('There is no item in your shoping cart') } 
        });
    }

    
    renderEditButton = (row) => {
        return <button type="button" className="btn btn-outline-info btn-xs" onClick={()=>{this.onEditItem(row)}}>
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>      
    }

    renderDeleteButton = (row) => { 
        return <button type="button" className="btn btn-outline-danger btn-xs" onClick={(event)=>{this.handleModalShowClick(row)}}>
                    <i className="fa fa-trash" aria-hidden="true"></i>
                </button>       
                  
    }



	renderRows = (currentBooks) => {
        // const renderBooks = currentBooks.map((book, index) => {
        //     return <li key={index}>{book}</li>;
        //   });
        return currentBooks.length > 0 ? 
        currentBooks.map((row) => {
          
            let imageSource = '../../assets/books/'+row.cover_image;
			return <tr key={row.id}>
				<td onClick={() => this.rowClickEvent(row)} key={row.id}>{row.id}</td>
				<td>{row.title}</td>
                <td>{row.author_name}</td>
                <td>{row.book_category}</td>  
				<td>{row.publish_date}</td>  
                <td><img className="small-image img-responsive" src={imageSource} onClick={() => this.rowClickEvent(row)}/></td>
                <td>{this.renderEditButton(row)}{this.renderDeleteButton(row)}</td>
               
			
			</tr>
		}) : null 

    }
    
    onClickNewCategory = () => {
        this.setState({showNewBook: true, showBooksList: false, showEditBook: false});
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
    
    // handleInputChange = () => {
    //     this.setState({
    //       query: this.search.value,
    //       showSuggestions: true
    //     }, () => {
    //       if (this.search.value && this.search.value.length > 1) {
    //         if (this.search.value.length % 2 === 0) {
    //           this.autoSuggestBooks()
    //         }
    //       } else if (!this.search.value) {
    //       }
    //     })
    //   }

      handleInputChange = (event) => {
		this.setState({
			query: event.target.value
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
        this.setState({showBooksList: value, showNewBook: false, showBookDetail: false, showEditBook: false});
        this.getBooksList();
    }

	render () {
        const { showModal } = this.state;
        const { booksList, currentPage, booksPerPage,upperPageBound,lowerPageBound,isPrevBtnActive,isNextBtnActive } = this.state;
        // Logic for displaying current books
        const indexOfLastBook = currentPage * booksPerPage;
        const indexOfFirstBook = indexOfLastBook - booksPerPage;
        const currentBooks = booksList.slice(indexOfFirstBook, indexOfLastBook);
       

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(booksList.length / booksPerPage); i++) {
          pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            if(number === 1 && currentPage === 1){
                return(
                    <li key={number} className='active' id={number}><a href='#' id={number} onClick={this.handleClick}>{number}</a></li>
                )
            }
            else if((number < upperPageBound + 1) && number > lowerPageBound){
                return(
                    <li key={number} id={number}><a href='#' id={number} onClick={this.handleClick}>{number}</a></li>
                )
            }
        });
        let pageIncrementBtn = null;
        if(pageNumbers.length > upperPageBound){
            pageIncrementBtn = <li className=''><a href='#' onClick={this.btnIncrementClick}> &hellip; </a></li>
        }
        let pageDecrementBtn = null;
        if(lowerPageBound >= 1){
            pageDecrementBtn = <li className=''><a href='#' onClick={this.btnDecrementClick}> &hellip; </a></li>
        }
        let renderPrevBtn = null;
        if(isPrevBtnActive === 'disabled') {
            renderPrevBtn = <li className={isPrevBtnActive}><span id="btnPrev"> Prev </span></li>
        }
        else{
            renderPrevBtn = <li className={isPrevBtnActive}><a href='#' id="btnPrev" onClick={this.btnPrevClick}> Prev </a></li>
        }
        let renderNextBtn = null;
        if(isNextBtnActive === 'disabled') {
            renderNextBtn = <li className={isNextBtnActive}><span id="btnNext"> Next </span></li>
        }
        else{
            renderNextBtn = <li className={isNextBtnActive}><a href='#' id="btnNext" onClick={this.btnNextClick}> Next </a></li>
        }
		return (
            <div className="main-books-page">
            {this.state.showBooksList &&  <div className="page-container-layout">
                    <div className="page-header">					
                        <h5>Books</h5>
                    </div>  
        
                    <div className="search-buttons-container">
                        <div className="input-group mb-3">
                            <button className="btn btn-primary pull-right" onClick={this.onClickNewCategory}><i className="fa fa-book"></i> Add Book</button>
                            <input type="text" className="form-control" onChange={this.handleInputChange} placeholder="Search for books by Title / Author / Category" aria-label="Recipient's username" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-info" onClick={this.keywordSearch}><i className="fa fa-search"></i></button>
                            </div>
                        </div>   
                    </div>
                    {showModal ? (<Modal handleModalCloseClick={this.handleModalCloseClick} handleConfirmClick={(event)=>{this.handleConfirmClick()}}/>) : null}
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
                                    <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderRows(currentBooks)}
                                </tbody>
                            </table>
                    </div> 
                </div>
                       
                </div>
        }
        {this.state.showNewBook && <NewBook onClick={this.changeHandler}></NewBook> }
        {this.state.showEditBook && <EditBook bookDetail={this.state.bookDetail} onClick={this.changeHandler}></EditBook> }
        {this.state.showBookDetail && <BookDetail bookDetail={this.state.bookDetail} onClick={this.changeHandler}></BookDetail> }
        {this.state.showBooksList ?
        <ul className="pagination">
              {renderPrevBtn}
              {pageDecrementBtn}
              {renderPageNumbers}
              {pageIncrementBtn}
              {renderNextBtn}
        </ul> :
         null}
    </div>  
   
          

        )
	}
}

Books.propTypes = {
    /** Props will go here */
}

