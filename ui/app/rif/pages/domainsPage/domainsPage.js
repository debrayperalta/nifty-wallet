import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SearchDomains } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import actions from '../../../actions'
import rifActions from '../../actions'
import { mockDomains } from '../../test/mocks'

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
		//Mocking data
		if(!localStorage.rnsDomains)
			localStorage.setItem('rnsDomains', JSON.stringify(mockDomains))
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
						<span>Auto-renew: <a href={this.props.setAutoRenew()}>{data.autoRenew ? "on" : "off"}</a></span>
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
		<SearchDomains />
		{this.state.domains.map((item, index) => {
			return this.chiplet(item, index)
		})}
	  </div>
	)
  }
}

DomainsScreen.propTypes = {
	showDomainsDetailPage: PropTypes.func.isRequired,
	setAutoRenew: PropTypes.func.isRequired,
	goHome: PropTypes.func.isRequired,

}

function mapStateToProps (state) {
  return {
	  dispatch: state.dispatch,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		showDomainsDetailPage: (data) => dispatch(rifActions.navigateTo('domainsDetail', data)),
		setAutoRenew: (data) => {},
		goHome: () => dispatch(actions.goHome()),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsScreen)
