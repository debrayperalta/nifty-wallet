import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArchive, faBolt, faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { getIconForToken } from '../../utils/utils'
import { CustomButton, SearchDomains } from '../../components'
import rifActions from '../../actions'

class DomainsDetailScreen extends Component {
	constructor(props) {
		super(props);
		let resolvers = []
		Object.assign(resolvers, props.resolvers);
		this.state = { 
			resolvers: resolvers,
			selectedResolverIndex: 0,
		};
	}
	navigateTo (url) {
		global.platform.openWindow({ url })
  	}

	render () {
		const { status, domainName, address, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage, domain } = this.props
		return (
		<div className={'body'}>
			<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack()}/>
			<SearchDomains />
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
						<div><span className={'domain-description-field'}>Address:&nbsp;</span><span className={'domain-description-value'}>{address}</span></div>
						<div><span className={'domain-description-field'}>Content:&nbsp;</span><span className={'domain-description-value'}>{content}</span></div>
						<div><span className={'domain-description-field'}>Expires on:&nbsp;</span><span className={'domain-description-value'}>{expirationDate}</span></div>
						<div><span className={'domain-description-field'}>Auto renew: <a href={this.props.setAutoRenew()}>{autoRenew ? "on" : "off"}</a></span></div>
						<div><span className={'domain-description-field'}>Owner:&nbsp;</span><span className={'domain-description-value'}>{ownerAddress}</span></div>
					</div>
					{isOwner &&
						<div id='resolversBody' className={'resolvers-body'}>
							<div className='resolver-body-top'>
								<div id='selectResolver' className={'custom-select'}>
									<select id='comboResolvers' className="select-css" onChange={(value) => this.setState({selectedResolverIndex:value.target.selectedIndex})}>
										{this.state.resolvers.map((resolver, index) => {
												return <option key={index} value={resolver.name}>{resolver.name}</option>
											})
										}								
									</select>
								</div>
								<div id='buttonNew' className={'custom-select'}>
									<CustomButton 
										icon={faPlusCircle} 
										text={'NEW'}
										onClick={() => this.props.addNewNetwork(domain, this.state.selectedResolverIndex)} 
										className={
											{
												button: 'domain-detail-new-button',
												icon: 'domain-icon centerY',
												text: 'center',
											}
										}
									/>
								</div>
							</div>
							<div id='resolverNetworksBody' className={'resolver-network'}>
								{this.state.resolvers[this.state.selectedResolverIndex].network.map((network, index) => {
									return <div key={index} className={'resolver-network-description'}>
											<FontAwesomeIcon icon={getIconForToken(network.networkIcon)} color="#000080" className={'domain-icon'}/>
											<span>{network.networkName}</span>
											<span className={'resolver-network-description-address'}>{network.address}</span>
										</div>
								})}
							</div>
						</div>
					}
				</div>
				<FontAwesomeIcon icon={faPlusCircle} className={'domain-description-plus-button'} onClick={() => {}}/>
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
	goBack: PropTypes.func.isRequired,
	addNewNetwork: PropTypes.func.isRequired,
	setAutoRenew: PropTypes.func.isRequired,
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
		resolvers: data.resolvers,
		domain: data,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		goBack: () => dispatch(rifActions.showDomainsPage()),
		addNewNetwork: () => {},
		setAutoRenew: () => {},
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailScreen)