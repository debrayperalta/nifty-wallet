import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArchive, faBolt } from '@fortawesome/free-solid-svg-icons'

class DomainsDetailScreen extends Component {
  navigateTo (url) {
	global.platform.openWindow({ url })
  }
  chiplet = (data) => {
	return <div id="chiplet" className={'chiplet'}>
		
	</div>
  }
  render () {
	  const { status, domainName, address, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage } = this.props
	return (
	  <div className={'body'}>
		{status === 'active' && 
		  <div>
			<div id='headerName' className={'domainName'}>
				<span>{domainName}</span>
				{isOwner &&
					<FontAwesomeIcon icon={faCheckCircle} color="#000080" className={'domainIcon'}/>
				}
				{isLuminoNode &&
					<FontAwesomeIcon icon={faBolt} color="#508871" className={'domainIcon'}/>
				}
				{isRifStorage &&
					<FontAwesomeIcon icon={faArchive} color="#AD3232" className={'domainIcon'}/>
				}
			</div>
			<div id='bodyDescription' className={'domainDescription'}>
				<div>Address: <span>{address}</span></div>
				<div>Content: <span>{content}</span></div>
				<div>Expires on: <span>{expirationDate}</span></div>
				<div>Auto renew: <span>{autoRenew}</span></div>
				<div>Owner: <span>{ownerAddress}</span></div>
			</div>
		  </div>
		}
		{status !== 'active' && 
			<div>
				Domain detail page still in progress for this status!
			</div>
		}
		
	  </div>
	)
  }
}

DomainsDetailScreen.propTypes = {
	status: PropTypes.string.isRequired,
	domainName: PropTypes.string.isRequired,
	address: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
	expirationDate: PropTypes.string.isRequired,
	autoRenew: PropTypes.bool.isRequired,
	ownerAddress: PropTypes.string.isRequired,
	isOwner: PropTypes.bool,
	isLuminoNode: PropTypes.bool,
	isRifStorage: PropTypes.bool,
}


function mapStateToProps (state) {
	const data = state.appState.currentView.data.value
  	return {
		dispatch: state.dispatch,
		status: data.status,
		domainName: data.domain,
		address: data.address,
		content: data.content,
		expirationDate: data.expiration,
		autoRenew: data.autoRenew,
		ownerAddress: data.ownerAddress,
		isOwner: state.metamask.selectedAddress.toLowerCase() === data.ownerAddress.toLowerCase(),
		isLuminoNode: data.isLuminoNode,
		isRifStorage: data.isRifStorage,
	}
}
module.exports = connect(mapStateToProps)(DomainsDetailScreen)