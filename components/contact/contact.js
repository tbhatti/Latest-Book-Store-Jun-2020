import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../containers/page-layout';
import Service from '../../api-service';



export default class Contact extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            firstName: '',
            lastName: '',
            email: '',
            comment: '',
            showSuccessMessage: false

        }
    }
    
    componentDidMount = () => { }

    submitFeedback = () => {
        console.log('SubMit Feedback ');
        let data = {"first_name": this.state.firstName, "last_name": this.state.lastName, "email": this.state.email, "commet": this.state.comment};
        let response = Service.contactUsRequest(data);
        this.setState({showSuccessMessage: response});
    }

   

    onFirstNameChange = (event) => {
        this.setState({firstName: event.target.value})
    }

    onLastNameChange = (event) => {
        this.setState({lastName: event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onCommentChange = (event) => {
        this.setState({comment: event.target.value})
    }

	render () {        
		return (<Layout>
            <div className="contact">
            {this.state.showSuccessMessage ? <div className="alert alert-danger alert-block">
                    <button className="close" data-dismiss="alert">&times;</button>
                        <span>Pleasure to hear from you.. <a href="/home" className="alert-link">Continue Shopping</a></span>
                </div> : null}
	<div className="row">
		<div className="col-md-3">
			<div className="contact-info">
				<img src="https://image.ibb.co/kUASdV/contact-image.png" alt="image"/>
				<h2>Contact Us</h2>
				<h4>We would love to hear from you !</h4>
			</div>
		</div>
		<div className="col-md-9">
			<div className="contact-form">
				<div className="form-group">
				  <label className="control-label col-sm-2" >First Name:</label>
				  <div className="col-sm-10">          
					<input type="text" onChange={this.onFirstNameChange} className="form-control" id="fname" placeholder="Enter First Name" name="fname"/>
				  </div>
				</div>
				<div className="form-group">
				  <label className="control-label col-sm-2" >Last Name:</label>
				  <div className="col-sm-10">          
					<input type="text" onChange={this.onLastNameChange} className="form-control" id="lname" placeholder="Enter Last Name" name="lname"/>
				  </div>
				</div>
				<div className="form-group">
				  <label className="control-label col-sm-2" >Email:</label>
				  <div className="col-sm-10">
					<input onChange={this.onEmailChange} type="email" className="form-control" id="email" placeholder="Enter email" name="email"/>
				  </div>
				</div>
				<div className="form-group">
				  <label className="control-label col-sm-2" >Comment:</label>
				  <div className="col-sm-10">
					<textarea onChange={this.onCommentChange} className="form-control" rows="5" id="comment"></textarea>
				  </div>
				</div>
				<div className="form-group">        
				  <div className="col-sm-offset-2 col-sm-10">
					<button type="submit" className="btn btn-default" onClick={this.submitFeedback}>Submit</button>
				  </div>
				</div>
			</div>
		</div>
	</div>
</div>
        </Layout>)
	}
}

Contact.propTypes = {
}

