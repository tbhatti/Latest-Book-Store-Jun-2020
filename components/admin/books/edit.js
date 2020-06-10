import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash';
import Layout from '../../../containers/page-layout';
import Service from '../../../api-service';
import Storage from '../../../local-storage';


export default class EditBook extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            redirectToAdminHome: false,
            authorsList: [],
            bookCategories: [],
            publishersList: [],
            bookTitle:  '',
            publishedDate: '',           
            selectedBookCategory: '',            
            selectedAuthor: '',
            bookFormat: '',
            bookDimensions: '',
            price: '',
            selectedPublisher: '', 
            error: '',
            bookDetail: {},

		}
		
    }
    
    componentDidMount = () => {	
        let data = [];
        if (this.props.match) {
            data = Service.getBookDetail(this.props.match.params.id);
            this.setState({ bookDetail: data[0]});
        }
        let userProfile = Storage.getUserProfile();
        this.setState({ userProfile: userProfile });

      
      let newDate = new Date(data[0].publish_date);
      let book = data[0];

      let publishDate = newDate.getFullYear()+'-'+this.pad(newDate.getUTCMonth() + 1)+'-'+this.pad(newDate.getUTCDate());
        this.setState({publishedDate: publishDate});
        this.setState({
            bookTitle:  book.title,
            selectedBookCategory: book.book_category,
            selectedAuthor: book.author_name,
            bookFormat: book.book_format,
            bookDimensions: book.book_dimension,
            price: book.price,
            selectedPublisher: book.publisher,
        });

        this.getCategoriesList();
        this.getAuthorsList();
        this.getPublishersList(); 
    }

    getCategoriesList = () => {
		let data = Service.getCategoriesListRequest()
		this.setState({ bookCategories: data });
	}

	getAuthorsList = () => {
		let data = Service.getAuthorsListRequest()
		this.setState({ authorsList: data });
	}

    getPublishersList = () => {
		let data = Service.getPublishersListRequest()
		this.setState({ publishersList: data });
    }

    onTitleChange = (event) => {
        this.setState({bookTitle: event.target.value})
    }

    onPriceChange = (event) => {
        this.setState({price: event.target.value})
    }

    onBookFormatChange = (event) => {
        this.setState({bookFormat: event.target.value})
    }

    onPublishedDateChange = (event) => {
        let newDate = new Date(event.target.value);
        let publishDate = newDate.getFullYear()+'-'+this.pad(newDate.getUTCMonth() + 1)+'-'+this.pad(newDate.getUTCDate());
        this.setState({publishedDate: publishDate});
           
    }

    onDimensionsChange = (event) => {
        this.setState({bookDimensions: event.target.value})
        
     }

    onChangeBooksCategory = (event) => {
        this.setState({selectedBookCategory: event.target.value});
        let data = Service.filterAuthorWithBookCategory(event.target.value);
        data.length > 0 ? this.setState({ error: '' }) : this.setState({ error: 'Authors with the given Genre does not exit' });
        this.setState({ authorsList: data });        
    }

    onChangeAuthor = (event) => {
        this.setState({selectedAuthor: event.target.value})
    }

    onChangePublisher = (event) => {
        this.setState({selectedPublisher: event.target.value})
    }
    

    updateBook = () => {

        let success = Service.updateBook({"id": this.state.bookDetail.id, "publisher": this.state.selectedPublisher, "book_dimension": this.state.bookDimensions, "book_format": this.state.bookFormat, "price": this.state.price, "title": this.state.bookTitle,  "publish_date": this.state.publishedDate, "book_category": this.state.selectedBookCategory, "author_name": this.state.selectedAuthor});
        this.setState({ redirectToAdminHome: true });         
    }

    cancelClickHandler = () => {
        this.setState({ redirectToAdminHome: true });
    }

    pad = (n) => {return n<10 ? '0'+n : n}

	render () {
        
       
		return (

            <Layout selectedTab="home">
				<div className="container-admin-home home-page"> 
					<div className="left-content">
						<div className="left-menu">
						</div>
					</div>
					<div className="right-content">
						<div className="container">
							<div className="row">
                                <div className="new-page">
                                    <div className='container page-header'>
                                        <h5>Edit Book</h5>
                                    </div>
                                    {this.state.error ? 
                                    <div className="alert alert-danger alert-block">
                                        <button className="close" data-dismiss="alert">&times;
                                        </button>
                                        <span>{this.state.error}</span>
                                    </div>
                                        : null
                                        }
                                    <div className="container-new-category">
                                        <div className="row">
                                            <div className="col">
                                                <fieldset >
                                                    <div className="form-group">
                                                        <label>Title</label>
                                                        <input type="text" id="title" className="form-control" value={this.state.bookTitle} placeholder="Book Title" onChange={this.onTitleChange}/>
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Book Category</label>
                                                        <select name="book-category" value={this.state.selectedBookCategory} className="form-control" onChange = {this.onChangeBooksCategory}>
                                                        <option hidden >Please Select</option>
                                                            {this.state.bookCategories.map(cat =>
                                                            <option id={cat.id} value={cat.name} key={cat.id}>{cat.name}</option>
                                                            )};
                                                        </select>
                                                    </div> 

                                                    <div className="form-group">
                                                        <label>Author Name</label>
                                                        <select name="author-name" value={this.state.selectedAuthor} className="form-control" onChange = {this.onChangeAuthor}>
                                                        <option  hidden>Please Select</option>
                                                            {this.state.authorsList.length ? this.state.authorsList.map(author =>
                                                            <option id={author.id} value={author.name} key={author.id}>{author.name}</option>
                                                            ) : null};
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label >Published Date</label>
                                                        <input type="date" className="form-control" id="end" name="trip"
                                                            value={this.state.publishedDate}
                                                            min="2018-01-01" max="2021-12-31" onChange={this.onPublishedDateChange}/>
                                                        
                                                    </div>

                                                    
                                                    <div className="form-group">
                                                        <label>Publisher</label>
                                                        <select name="publisher"  value={this.state.selectedPublisher} className="form-control" onChange = {this.onChangePublisher}>
                                                        <option  hidden>Please Select</option>
                                                            {this.state.publishersList.map(pub =>
                                                            <option id={pub.id} value={pub.name} key={pub.id}>{pub.name}</option>
                                                            )};
                                                        </select>
                                                    </div>
                                
                                                </fieldset>
                                            </div>
                                            <div className="col">
                                                <fieldset >
                                                    <div className="form-group">
                                                        <label>Price</label>
                                                        <input type="text" id="price" className="form-control"  placeholder="Price" value={this.state.price} onChange={this.onPriceChange}/>
                                                    </div>

                                                    <div className="form-group">
                                                    <label>Book Format</label>
                                                    <input type="text" id="bookFormat" className="form-control"  placeholder="Book Format" value={this.state.bookFormat} onChange={this.onBookFormatChange}/>
                                                    </div>

                                                    <div className="form-group">
                                                    <label>Book Dimensions</label>
                                                    <input type="text" id="BookDimensions" className="form-control"  placeholder="Book Dimensions" value={this.state.bookDimensions} onChange={this.onDimensionsChange}/>
                                                    </div>

                                                    <form ref='uploadForm' 
                                                    id='uploadForm' 
                                                    action="http://localhost:5000/upload"
                                                    method='post' 
                                                    target="_blank"
                                                    encType="multipart/form-data">
                                                        <span className="filewrap">
                                                            Choose book image
                                                            <input type="file"  name="myCV" />
                                                        </span>
                                                        {/* <input type="file" className="form-control" name="myCV" /> */}
                                                        <input type='submit' className="btn btn-success" value='Upload!' />
                                                    </form>                                
                                                </fieldset>
                                            </div>
                            
                                        </div>
                    
                                    </div>
                                    {this.state.redirectToAdminHome && <Redirect to={`/admin`} />}
                                    <div className="row float-right">
                                        <button className="btn btn-primary" onClick={this.updateBook}>Update Book</button>
                                        <button className="btn btn-secondary" onClick={this.cancelClickHandler}>Cancel</button>
                                    </div>
                            
                                </div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
        )
	}
}

EditBook.propTypes = {
}

