
import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom'
import {setProfile} from '../../actions/user';
import {connect} from 'react-redux';
import Storage from '../../local-storage';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            errorMessage: '',
            showError: false,
            redirect: false,
            isAdmin: false,
            // User Object for Registeration
            firstName: '',
            lastName: '',
            email: '',
            userPassword: '',
            signupMessage: '',
            showSignupMessage: false

    };
      }
    componentDidMount = () => {
        Storage.clearLocalStorage();
    }
      onSignInClick = (event) => {
        let user = null;
        event.preventDefault();
           $.ajax({  
            type: "POST",  
            url: "http://localhost:5000/login",  
            data: JSON.stringify({"email": this.state.username, "password": this.state.password}),  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (response) => {  
                user = response[0];
               

                if(response['error']) {
                    this.setState({showSignupMessage: false,errorMessage: 'User with the given username does not exist', showError: true});
                } else {
                    this.props.dispatch(setProfile(user))
                   
                    let loggedInUser ={name: user.first_name, id: user.id, role: user.user_role};
                    Storage.addToLocalStorage(JSON.stringify(loggedInUser));
                    
                   if(user['user_role'] === 'admin') {
                    console.log('------------------------------------------',user['user_role']);
                        this.setState({isAdmin: true, errorMessage: '', showError: false, redirect: true});
                   } else {
                    
                        this.setState({isAdmin: false, errorMessage: '', showError: false, redirect: true});
                   }
                    
                   
                }
               
               // <Redirect to='www.google.com'  />
            },
            error: ()=> {
                this.setState({errorMessage: 'User with the given username does not exist', showError: true});

              } 
        });
    }

    typeUsername = (event) => {
       // console.log(event.target.value)
		this.setState({username: event.target.value})
	}

    typePwd = (event) => {
		this.setState({password: event.target.value})
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

    onPasswordChange = (event) => {
        this.setState({userPassword: event.target.value})
    }
    
    onJoinClick = (event) => {
        event.preventDefault();
        $.ajax({  
            type: "POST",  
            url: "http://localhost:5000/register-user",  
            data: JSON.stringify({"first_name": this.state.firstName, "last_name": this.state.lastName, "email": this.state.email, "password": this.state.userPassword}),  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (dataString) => {  
                //this.setState({errorMessage: '', showError: false, redirect: true});
                this.setState({signupMessage: 'You have successfuly joined us', showSignupMessage: true, firstName: '', lastName: '',email: '', password: ''});
            },
            error: ()=> {
                this.setState({errorMessage: 'User with the given Email address does not exist', showError: true});

              } 
        });
    }

    onHideError = () => {
        this.setState({showError: false, showSignupMessage: false});
    }




  render() {
    const {user} = this.props.userReducer;
    return (
        <div className="container-main-page">       
           { this.state.showError ?  
               <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Login error! </strong>{this.state.errorMessage}
                <button type="button" className="close" data-hide="alert" aria-label="Close" onClick={this.onHideError}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            : null}
            { this.state.showSignupMessage ?  
               <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Congratulations! </strong>{this.state.signupMessage}
                <button type="button" className="close" data-hide="alert" aria-label="Close" onClick={this.onHideError}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            : null}
           <div className="container">
                <div className="row">
                    <div className="col order-last">
                    <form>
                    <div className="row">
                        <div className="col">
                        <input type="text" className="form-control" placeholder="Email" onChange={this.typeUsername} />
                        </div>
                        <div className="col">
                        <input type="password" className="form-control" placeholder="Password" onChange={this.typePwd} />
                        </div>
                        <div className="col">
                            <button type="submit" className="btn btn-primary"  onClick={this.onSignInClick}>Sign in</button>
                        </div>
                    </div>
                    </form>
                    
                    </div>
                    
                    <div className="col order-1">
                    <img className='Talent Manager' src='../../assets/logo.png' alt='Talent Manager'  />
                    </div>
                </div>          
            </div>

            

            {/*Sign Up*/}

            <div className="container-sign-up">
            <div className="row">
                <div className="header">
                    <p className="be-great-paragraph">Be great at what you do</p>
                    <p className="get-started-paragraph">Get started - it's free.</p>
                </div>
                <form>
                    <fieldset>
                        <div className="form-group">
                        <label>First Name</label>
                        <input type="text" id="fistNameTextInput" className="form-control" placeholder="First Name" onChange={this.onFirstNameChange}/>
                        </div>
                        <div className="form-group">
                            <label >Last Name</label>
                            <input type="text" id="lastNameTextInput" className="form-control" placeholder="Last Name" onChange={this.onLastNameChange}/>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" id="emailTextInput" className="form-control" placeholder="Email" onChange={this.onEmailChange}/>
                        </div>
                       
                        <div className="form-group">
                            <label>Password (7 or more characters)</label>
                            <input type="password" id="passwordTextInput" className="form-control" placeholder="Password" onChange={this.onPasswordChange} />
                        </div>

                        <div className="form-group">
                            <label className="label-privacy-policy"> By clicking Join now, you agree to the Book Store User Agreement, Privacy Policy, and Cookie Policy.</label>
                            
                        </div>
                        <button type="submit" className="btn btn-success btn-join" onClick={this.onJoinClick}>Join Now</button>
                    </fieldset>
                </form>
            </div>
            </div>
         {this.state.redirect && !this.state.isAdmin && <Redirect to="/home" />}
         {this.state.redirect && this.state.isAdmin && <Redirect to="/admin" />}
         <div className="container-footer">
        &copy; Copyright 2020 Book Store

         </div>
         
 </div>

        

    );
  }
}

export default connect(state => state)(Login);
