import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from "react-dropdown-select"
import rifActions from '../../rif/actions'

class SearchDomains extends Component {
	state = {
		domains: [],
	}
	constructor(props) {
		super(props);
		if(localStorage.rnsDomains){
			let domains = JSON.parse(localStorage.rnsDomains);
			this.state = { 
				domains: domains,
			}
		}	
	}
  render () {
	return (
		<Select 
			options={this.state.domains} 
			searchBy={'domain'} 
			valueField={'domain'} 
			labelField={'domain'} 
			onChange={(values) => this.props.showDomainsDetailPage(values[0])} 
			color={'#0074D9'}  
			placeholder="Search for domains"
			searchable={true}
		/>
	)
  }
}

SearchDomains.propTypes = {
	showDomainsDetailPage: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
  return {
	  dispatch: state.dispatch,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showDomainsDetailPage: (data) => dispatch(rifActions.showDomainsDetailPage(data)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SearchDomains)