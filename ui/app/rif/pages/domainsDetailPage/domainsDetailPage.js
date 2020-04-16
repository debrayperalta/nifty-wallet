import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faArchive, faBolt, faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { getIconForToken } from '../../utils/utils'
import { CustomButton, SearchDomains } from '../../components'
import rifActions from '../../actions'
import { cryptos } from '../../constants'

class DomainsDetailScreen extends Component {
	static propTypes = {
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
	constructor(props) {
		super(props);
		let resolvers = []
		Object.assign(resolvers, props.resolvers);
		this.state = { 
			resolvers: resolvers,
			selectedResolverIndex: 0,
			selectedNetwork: '',
			insertedAddress: '',
		};
	}
	_updateNetwork = (e) => {
		this.setState({ selectedNetwork: e.target.value })
	}
	_updateAddress = (e) => {
		this.setState({ insertedAddress: e.target.value })
	}
	_addAddress = () => {
		let domains = JSON.parse(localStorage.rnsDomains);
		let myIndex = -1
		let resolverIndex = this.state.selectedResolverIndex
		let selecteddomain = domains.find((domain, index) => {
			if(domain.domain === this.props.domain.domain){
				myIndex = index
				return domain
			}
		})

		if(myIndex !== -1 && resolverIndex !== -1){
			let newNetwork = {
				networkName: this.state.selectedNetwork,
				networkIcon:this.state.selectedNetwork,
				address: this.state.insertedAddress,
			}
			domains[myIndex].resolvers[resolverIndex].network.push(newNetwork)
			localStorage.setItem('rnsDomains', JSON.stringify(domains))
			//Sending back with localstorage rnsDomains (Here we try to get again localstorage so if it wasnt updated, we're going to show whats really saved)
			//domains = JSON.parse(localStorage.rnsDomains)
			//this.props.goBack(domains[myIndex])
		}
	}
	showModalAddNetworkAddress = () => {
		let networks = new Set()
		let selectFirst = true
		let selected = ''
		Object.keys(cryptos).forEach(function(key) {
			networks.add(key)
			if(selectFirst){
				selected = key
				selectFirst = false
			}
		});
		this.setState({ selectedNetwork: selected })
		let message = {
			title: 'Add new network',
			body: { 
				elements: <div>
					<div id='comboNetworks' className={'add-new-multicrypto-select'}>
						<select id='comboNetworks' className="select-css" onChange={this._updateNetwork}>
							{[...networks].map((network, index) => {
									return <option key={index} value={network}>{network.toUpperCase()}</option>
								})
							}	
						</select>
					</div>
					<div id='inputAddress' className={'full-width add-new-multicrypto-input'}>
						<input type='text' placeholder="value" onChange={this._updateAddress}/>
					</div>
				</div>
			},
			confirmLabel: 'SAVE',
			cancelLabel: 'CANCEL',
			confirmCallback: () => {
				this._addAddress()
			},
			cancelCallback: () => {
			},
		}
		this.props.addNewNetwork(message)
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
										onClick={() => this.showModalAddNetworkAddress()} 
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
		//addNewNetwork: (domain, selectedResolverIndex) => dispatch(rifActions.showAddNewMulticryptoAddressPage(domain, selectedResolverIndex)),
		addNewNetwork: (message) => dispatch(rifActions.showRifModal(message)),
		setAutoRenew: () => {},
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailScreen)