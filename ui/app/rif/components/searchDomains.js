import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import rifActions from '../../rif/actions'
import actions from '../../actions'

class SearchDomains extends Component {
	_handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			let insertedDomain = e.target.value.toLowerCase()
			//Theres a limitation in manager that domains with less 5 characters are blocked
			if(insertedDomain.length < 5){
				this.props.displayWarning("Domains with less than 5 characters are blocked.")
				return
			}

			let domains = JSON.parse(localStorage.rnsDomains);
			let existDomain = domains.find(domain => domain.domain === insertedDomain)
			if(existDomain)
				return this.props.showDomainsDetailPage(existDomain)
			//Checks if the domain is available, so if it is, it need to render a screen so the user can register it
			this.props.checkDomainAvailable(insertedDomain).then(domain => {
				if(domain.length > 0)
					this.props.showDomainRegisterPage(domain)
				else{
					this.props.getDomainDetails(insertedDomain).then(details => {
						console.debug("Details retrieved", details)
						return this.props.showDomainsDetailPage(details)
					}).catch(error => {
						console.debug("Error retrieving domain details", error)
						this.props.displayWarning("An error happend trying to get details from domain, please try again later.")
					})
				}
				//We need to put an else here, so we can redirect to details page, remember that the localstorage part of code, will not be anymore here
				
			}).catch(error => {
				console.debug("Error retrieving domain details", error)
				this.props.displayWarning("An error happend checking if domain is available, please try again later.")
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
		checkDomainAvailable: (domainName) => dispatch(rifActions.checkDomainAvailable(domainName)),
		getDomainDetails: (domainName) => dispatch(rifActions.getDomainDetails(domainName)),
		displayWarning: (message) => dispatch(actions.displayWarning(message)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchDomains)