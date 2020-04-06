import React, { Component } from 'react';
import { connect } from 'react-redux'
import actions from '../../actions'

const testStyle = {
	body: {
		width: '100%', 
	},
	chiplet: {
		backgroundColor: '#E1EEF9',
		width: '90%', 
		fontSize: '14px',
		//height: '50px',
		color: '#242A30',
		margin: '5%',
		padding:'1rem',
		title: {
			color: 'black',
			fontSize: '17px',
			fontWeight: 'bold',
		},
		description: {
			paddingLeft: '1.5rem',
		}
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

class DomainsScreen extends Component {
  navigateTo (url) {
	global.platform.openWindow({ url })
  }
  chiplet = (data) => {
	  console.log("Data", data)
	return <div id="chiplet" style={testStyle.chiplet}>
		<div id="chipletTitle" style={testStyle.chiplet.title}>
			{data.domain}
		</div>
		<div id="chipletDescription" style={testStyle.chiplet.description}>	
			<div id="chipletExpiration">
				Expiration: {data.expiration}
			</div>
			<div id="chipletRenew">
				Auto-renew: {data.autoRenew ? 'on' : 'off'}
			</div>
			<div id="chipletStatus">
				{data.status}
			</div>
		</div>
		<hr/>
	</div>
  }
  render () {
	  console.log("qty", mockDomains.length)
	return (
	  <div style={testStyle.body}>
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