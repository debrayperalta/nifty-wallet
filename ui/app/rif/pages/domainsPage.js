import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import rifActions from '../../rif/actions'

const mockDomains = [
	{
		domain: 'domain1.rsk',
		expiration: '3030/03/02',
		autoRenew: true,
		status: 'active',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x5F4df703Da966E12d3068E1aCbe930f2E363c732',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'blockchain.rsk',
		expiration: '2020/06/10',
		autoRenew: true,
		status: 'pending',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'charrua.rsk',
		expiration: '2019/12/31',
		autoRenew: false,
		status: 'expired',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
	{
		domain: 'lakers.rsk',
		expiration: '2020/05/01',
		autoRenew: false,
		status: 'expiring',
		address: '0x123456789',
		content: 'abcdefg1234abcd1234aaaabbbbddddd',
		ownerAddress: '0x123456789',
		isLuminoNode: true,
		isRifStorage: true,
	},
]

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
  navigateTo (url) {
	global.platform.openWindow({ url })
  }
  chiplet = (data, id) => {
	return <div id="chiplet" className={'chiplet'} key={id}>
		<div className={'chiplet-body'}>
			<div onClick={() => this.props.showDomainsDetailPage(data)} id="chipletTitle" className={'chiplet-title'}>
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
		{mockDomains.map((item, index) => {
			return this.chiplet(item, index)
		})}
	  </div>
	)
  }
}

DomainsScreen.propTypes = {
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsScreen)