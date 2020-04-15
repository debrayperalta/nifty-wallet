import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import rifActions from '../../rif/actions'

class SearchDomains extends Component {
	_handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			let domains = JSON.parse(localStorage.rnsDomains);
			let existDomain = domains.find(domain => domain.domain === e.target.value.toLowerCase())
			if(existDomain)
				return this.props.showDomainsDetailPage(existDomain)

			//Here goes the logic to search domains that are not in localstorage
		}
	}
	render () {
		return (
			<input 
				placeholder="Search for domains"
				className={'search-bar'}
				onKeyDown={this._handleKeyDown}
			/>
		)
	}
}

function mapStateToProps (state) {
  return {
	  dispatch: state.dispatch,
	}
}

SearchDomains.propTypes = {
	showDomainsDetailPage: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => {
	return {
		showDomainsDetailPage: (data) => dispatch(rifActions.showDomainsDetailPage(data)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchDomains)