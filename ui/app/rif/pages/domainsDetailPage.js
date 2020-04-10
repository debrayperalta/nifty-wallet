import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArchive, faBolt, faChevronLeft, faCoins, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons'
import rifActions from '../../rif/actions'
import actions from '../../actions'

class DomainsDetailScreen extends Component {
	state = {
		resolvers: this.props.resolvers,
		selectedResolverIndex: 0,
	}
	navigateTo (url) {
		global.platform.openWindow({ url })
  	}
	admitedCoins = (coin) => {
		let value = faCoins
		switch (coin.toLowerCase()){
			case 'bitcoin':
				value = faBitcoin
			break
			case 'ethereum':
				value = faEthereum
			break
		}
		return value
	}
	render () {
		const { status, domainName, address, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage } = this.props
		return (
		<div className={'body'}>
			<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack()}/>
			{status === 'active' && 
			<div>
				<div id='headerName' className={'domain-name'}>
					<span>{domainName}</span>
					{isOwner &&
						<FontAwesomeIcon icon={faCheckCircle} color="#000080" className={'domain-icon'}/>
					}
					{isLuminoNode &&
						<FontAwesomeIcon icon={faBolt} color="#508871" className={'domain-icon'}/>
					}
					{isRifStorage &&
						<FontAwesomeIcon icon={faArchive} color="#AD3232" className={'domain-icon'}/>
					}
				</div>
				<div id='domainDetailBody' className={'domain-detail-body'}>
					<div id='bodyDescription' className={'domain-description'}>
						<div>Address: <span>{address}</span></div>
						<div>Content: <span>{content}</span></div>
						<div>Expires on: <span>{expirationDate}</span></div>
						<div>Auto renew: <span>{autoRenew}</span></div>
						<div>Owner: <span>{ownerAddress}</span></div>
					</div>
					{isOwner &&
						<div id='resolversBody' className={'resolvers-body'}>
							<div className='resolver-body-top'>
								<div id='selectResolver' className={'custom-select'}>
									<select id='comboResolvers' onChange={(value) => this.setState({selectedResolverIndex:value.target.selectedIndex})}>
										{this.state.resolvers.map((resolver, index) => {
												return <option key={index} value={resolver.name}>{resolver.name}</option>
											})
										}								
									</select>
								</div>
								{
									//TODO
									//This button will need to be moved to a component later
								}
								<div id='buttonNew' className={'domain-detail-new-button'} onClick={() => this.props.addNewNetwork()}>
									<div id='buttonBody'>
										<FontAwesomeIcon icon={faPlusCircle} color="#235BAC" className={'domain-icon centerY'}/>
										<span className={'center'}>NEW</span>
									</div>
								</div>
							</div>
							<div id='resolverNetworksBody' className={'resolver-network'}>
								{this.state.resolvers[this.state.selectedResolverIndex].network.map((network, index) => {
									return <div key={index} className={'resolver-network-description'}>
											<FontAwesomeIcon icon={this.admitedCoins(network.networkIcon)} color="#000080" className={'domain-icon'}/>
											<span>{network.networkName}</span>
											<span className={'resolver-network-description-address'}>{network.address}</span>
										</div>
								})}
							</div>
						</div>
					}
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
		goBack: PropTypes.func.isRequired,
		addNewNetwork: PropTypes.func.isRequired,
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
		resolvers: data.resolvers,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		goBack: () => dispatch(rifActions.showDomainsPage()),
		addNewNetwork: () => dispatch(rifActions.showAddNewMulticryptoAddressPage())
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailScreen)