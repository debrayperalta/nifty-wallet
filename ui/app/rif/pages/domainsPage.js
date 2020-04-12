import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from "react-dropdown-select"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import actions from '../../actions'
import rifActions from '../../rif/actions'

function statusStyle(status){
	switch(status){
		case 'active':
			return 'chiplet-status-active'
		case 'pending':
			return 'chiplet-status-pending'
		case 'expired':
			return 'chiplet-status-expired'
		case 'expiring':
			return 'chiplet-status-expiring'
	}
}

class DomainsScreen extends Component {
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
	navigateTo (url) {
		global.platform.openWindow({ url })
	}

	chiplet = (data, id) => {
		return <div id="chiplet" className={'chiplet'} key={id}>
			<div className={'chiplet-body'}>
				<div onClick={() => {this.props.showDomainsDetailPage(data)}} id="chipletTitle" className={'chiplet-title'}>
					{data.domain}
				</div>
				<div id="chipletDescription" className={'chiplet-description'}>	
					<div id="chipletExpiration">
						<span>Expires on: {data.expiration}</span>
					</div>
					<div id="chipletRenew">
						<span>Auto-renew: {data.autoRenew ? 'on' : 'off'}</span>
					</div>
				</div>
			</div>
			<div className={'chiplet-status-wrapper ' + statusStyle(data.status)}>
				<div id="chipletStatus" className={'chiplet-status-text'}>
					{data.status}
				</div>
			</div>
		</div>
	}

  render () {
	return (
	  <div className={'body'}>
		<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goHome()}/>
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
		{this.state.domains.map((item, index) => {
			return this.chiplet(item, index)
		})}
	  </div>
	)
  }
}

DomainsScreen.propTypes = {
	showDomainsDetailPage: PropTypes.func.isRequired,
	goHome: PropTypes.func.isRequired,

}

function mapStateToProps (state) {
  return {
	  dispatch: state.dispatch,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showDomainsDetailPage: (data) => dispatch(rifActions.showDomainsDetailPage(data)),
		goHome: () => dispatch(actions.goHome()),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsScreen)