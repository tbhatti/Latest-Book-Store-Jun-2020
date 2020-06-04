import React from 'react';
import  { Redirect } from 'react-router-dom'
import _ from 'lodash'
import Layout from '../../containers/page-layout'


export default class UserDetails extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
            userDetail: {},
            editable: false,
            redirect: false,
            usersList: []
		}
      this.datas = {}
		
    }
    
    componentDidMount = () => {
        console.log('componentDidMount get called', this.state.userDetail,  'Data',  this.datas)
        $.ajax({  
			type: "GET",  
			url: "http://localhost:5000/users-list",  
		   // data: JSON.stringify({"email": this.state.email}),  
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: (dataString) => { 
				//console.log('DATA===>', dataString)
				this.setState({usersList: dataString});
			},
			error: ()=> {
				//this.setState({errorMessage: 'User with the given Email address does not exit', showError: true});

			  } 
		});
        
        //console.log('componentDidMount get called after', this.state.userDetail, 'Data',  this.datas)
		
    }

    onFirstNameChange = (event) => {
        let userInfo = _.cloneDeep(this.state.userDetail)
        userInfo['first_name'] = event.target.value
        this.setState({userDetail: userInfo})
    }

    onLastNameChange = (event) => {
        let userInfo = _.cloneDeep(this.state.userDetail)
        userInfo['last_name'] = event.target.value
        this.setState({userDetail: userInfo})
    }

    onEmailChange = (event) => {
        let userInfo = _.cloneDeep(this.state.userDetail)
        userInfo['email'] = event.target.value
        this.setState({userDetail: userInfo})
    }
    
    onUpdateClick = () => {
        $.ajax({  
            type: "POST",  
            url: "http://localhost:5000/update-user",  
            data: JSON.stringify({"first_name": this.state.userDetail.first_name, "last_name": this.state.userDetail.last_name, "email": this.state.userDetail.email, "id": this.state.userDetail.id}),  
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: (dataString) => {  
                console.log('SUCCESSFULLY DONE____!')
                this.setState({editable: false, redirect: true})
            },
            error: ()=> {
                console.log('ERRROR DONE____!')

              } 
        });
    }

    onEditClick = () => {
       this.setState({editable: true})
    }

    rowClickEvent = (row) => {
		// console.log('EVENT=>', row)
		// this.setState({redirect: true, userID: row.id})
	}

	renderRows = () => {
		return this.state.usersList.map((row) => {
			return <tr onClick={() => this.rowClickEvent(row)}>
				<td>{row.id}</td>
				<td>{row.name}</td>
				<td>{row.email}</td>
			
			</tr>
		})

	}


	render () {
		return (
            <Layout selectedTab="book-categories">
			<div className="main-container">
                 <div className="container-edit-user">
                    <div className="row">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.renderRows()}
                            </tbody>
                         </table>
                        
                </div>
            </div>
            {this.state.redirect && <Redirect to="/home" />}
            </div>
            </Layout>

        )
	}
}

UserDetails.propTypes = {
	user: React.PropTypes.string
}

