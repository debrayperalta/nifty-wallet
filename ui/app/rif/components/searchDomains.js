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
			//Checks if the domain is available, so if it is, it need to render a screen so the user can register it
			this.props.checkDomainAvailable(e.target.value.toLowerCase()).then(ret => {
				if(ret.length > 0)
					this.props.showDomainRegisterPage(ret)
				//We need to put an else here, so we can redirect to details page, remember that the localstorage part of code, will not be anymore here
				
			})
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
		showDomainRegisterPage: (domainName) => dispatch(rifActions.showDomainRegisterPage(domainName)),
		checkDomainAvailable: (domainName) => dispatch(rifActions.checkDomainAvailable(domainName))
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchDomains)