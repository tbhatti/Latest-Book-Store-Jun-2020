import React from 'react';
export default class Suggestions extends React.Component {
    
    
    handleLangChange = (event) => {
        this.props.onBookSelect(event.target.innerHTML);            
    }

    renderList = () => {
        let options = this.props.results.map(r => (
            <li key={r.id} onClick={this.handleLangChange} value={r.title}>
              {r.title}
            </li>
          ))

          return options
    }

    render () {
        
		return (
            <ul className="auto-suggest">{this.renderList()}</ul>
        )
	}
}

Suggestions.propTypes = {
    results: React.PropTypes.array,
    onBookSelect: React.PropTypes.func
}