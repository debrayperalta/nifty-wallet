import React, { Component } from 'react';
import { connect } from 'react-redux'
import actions from '../../actions'

const mockDomains = [
	{
		domain: 'domain1.rsk',
		expiration: '3030/03/02',
		autoRenew: true,
		status: 'active',
	},
	{
		domain: 'blockchain.rsk',
		expiration: '2020/06/10',
		autoRenew: true,
		status: 'pending',
	},
	{
		domain: 'charrua.rsk',
		expiration: '2019/12/31',
		autoRenew: false,
		status: 'expired',
	},
	{
		domain: 'lakers.rsk',
		expiration: '2020/05/01',
		autoRenew: false,
		status: 'expiring',
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
  chiplet = (data) => {
	return <div id="chiplet" className={'chiplet'}>
		<div className={'chiplet-body'}>
			<div id="chipletTitle" className={'chiplet-title'}>
				{data.domain}
			</div>
			<div id="chipletDescription" className={'chiplet-description'}>	
				<div id="chipletExpiration">
					Expiration: {data.expiration}
				</div>
				<div id="chipletRenew">
					Auto-renew: {data.autoRenew ? 'on' : 'off'}
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
		{mockDomains.map((item) => {
			return this.chiplet(item)
		})}
	  </div>
	)
  }
}
function mapStateToProps (state) {
  return {dispatch: state.dispatch}
}
module.exports = connect(mapStateToProps)(DomainsScreen)