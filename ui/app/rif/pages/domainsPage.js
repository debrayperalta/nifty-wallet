import React, { Component } from 'react';
import { connect } from 'react-redux'
import actions from '../../actions'

const testStyle = {
	body: {
		width: '100%', 
	},
	chiplet: {
		width: '90%',
		height: '100px', 
		fontSize: '14px',
		color: '#242A30',
		margin: '5px',
		padding:'0.5rem',
		title: {
			color: 'black',
			fontSize: '17px',
			fontWeight: 'bold',
		},
		description: {
			paddingLeft: '1.5rem',
		},
		body:{
			width: '85%',
			height: '100%',
			float: 'left',
			borderBottom: '2.5px solid #EEEEEE',
		},
		statusWrapper: {
			width: '15%',
			height: '100%', 
			float: 'right',
			position: 'relative',
			backgroundColor: '#C0D6E4',
			borderLeft: '5px solid black',
		},
		statusText: {
			position: 'absolute',
			top: '50%',
  			left: '50%',
			transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)'
		},
	},
  }

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
	  console.log("Data", data)
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