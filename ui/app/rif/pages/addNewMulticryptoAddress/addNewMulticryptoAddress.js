import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { CustomButton } from '../../components'
import rifActions from '../../actions'
import { cryptos } from '../../constants'

class AddNewMulticryptoAddressScreen extends Component {
	state = {
		networks: [],
		address: '',
		network: '',
	}
	constructor(props) {
		super(props);
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
		this.state = { 
			networks: [...networks],
			network: selected,
		};
	}

	navigateTo (url) {
		global.platform.openWindow({ url })
	}
	addAddress = () => {
		let domains = JSON.parse(localStorage.rnsDomains);
		let myIndex = -1
		let resolverIndex = this.props.selectedResolver
		let selecteddomain = domains.find((domain, index) => {
			if(domain.domain === this.props.domain.domain){
				myIndex = index
				return domain
			}
		})
		if(myIndex !== -1 && resolverIndex !== -1){
			let newNetwork = {
				networkName: this.state.network,
				networkIcon:this.state.network,
				address: this.state.address,
			}
			domains[myIndex].resolvers[resolverIndex].network.push(newNetwork)
			localStorage.setItem('rnsDomains', JSON.stringify(domains))
			//Sending back with localstorage rnsDomains (Here we try to get again localstorage so if it wasnt updated, we're going to show whats really saved)
			domains = JSON.parse(localStorage.rnsDomains)
			this.props.goBack(domains[myIndex])
		}
	}
	_updateAddress = (e) => {
		this.setState({address: e.target.value})
	}
	_updateNetwork = (e) => {
		this.setState({network: e.target.value})
	}
	render () {
		return (
		<div className={'body'}>
			<FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack(this.props.domain)}/>
			<div style={{position: 'relative',}}>
				<div id='title' className={'full-width add-new-multicrypto-title'}>
					<span>Add new network</span>
				</div>
				<div id='comboNetworks' className={'full-width add-new-multicrypto-select'}>
					<select id='comboNetworks' className="select-css" onChange={this._updateNetwork}>
						{this.state.networks.map((network, index) => {
								return <option key={index} value={network}>{network}</option>
							})
						}	
					</select>
				</div>
				<div id='inputAddress' className={'full-width add-new-multicrypto-input'}>
					<input type='text' placeholder="value" onChange={this._updateAddress}/>
				</div>
				<div id='bottomForm' className={'full-width add-new-multicrypto-bottom'}>
					<div id='buttonCancel' className={'add-new-multicrypto-button-cancel'}>
						<CustomButton 
							text={'CANCEL'}
							onClick={() => this.props.goBack(this.props.domain)} 
							className={
								{
									button: 'custom-button-cancel center',
									text: 'center',
								}
							}
						/>
					</div>
					<div id='buttonSave' className={'add-new-multicrypto-button-save'}>
						<CustomButton 
							text={'SAVE'}
							onClick={() => this.addAddress()} 
							className={
								{
									button: 'custom-button-success center',
									text: 'center',
								}
							}
						/>
					</div>
				</div>
			</div>
		</div>
		)
	}
}

AddNewMulticryptoAddressScreen.propTypes = {
	goBack: PropTypes.func.isRequired,
}

function mapStateToProps (state) {
	const data = state.appState.currentView.data.value
	return {
		dispatch: state.dispatch,
		domain: data.domain,
		selectedResolver: data.selectedResolverIndex
	}
}

const mapDispatchToProps = dispatch => {
	return {
		goBack: (data) => dispatch(rifActions.showDomainsDetailPage(data)),
	}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AddNewMulticryptoAddressScreen)