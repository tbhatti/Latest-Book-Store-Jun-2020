import React from 'react';
import SourcingSolutions from '../header/sourcing/sourcing-solutions'
import ServicesAndSolutions from '../header/services-memberships/services-memberships'
import HelpAndCommunity from '../header/help-community/community'
import Introduction from '../home/introduction'

class Page extends React.Component {

	constructor(props) {
        super(props);
        this.state = {
            }
            
            console.log('Props in Page=>', props)
      }	

	render () {
		return (
            <div className='container'>
			    <div className='container-user-profile'>
					{this.state.userProfile ? <div className='conatiner-welcome'>Welcome: {this.state.userProfile.name}</div> : null }
				</div>
				<div className='container-top-header'>
					<SourcingSolutions />
					<ServicesAndSolutions />
					<ServicesAndSolutions />
					<HelpAndCommunity />
								
			    </div>
                {this.props.children || 'dashboard-page'}
            </div>
        
		)
	}
}
export default Page

Page.propTypes = {
	children: React.PropTypes.object
}
