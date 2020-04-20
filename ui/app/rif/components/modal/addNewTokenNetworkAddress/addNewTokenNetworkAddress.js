import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'

class AddNewTokenNetworkAddress extends Component {
	static propTypes = {
		updateNetwork: PropTypes.func.isRequired,
		updateAddress: PropTypes.func.isRequired,
		networks: PropTypes.array.isRequired,
	}
    constructor(props) {
        super(props);
		let networks = []
		Object.assign(networks, props.networks)
		this.state = { 
            networks: networks,
			selectedNetwork: networks[0],
			insertedAddress: '',
		};
	}
	updateNetwork = (selectedOption) => {
		this.setState({ selectedNetwork: selectedOption })
		this.props.updateNetwork(selectedOption)
	}
	updateAddress = (e) => {
		this.setState({ insertedAddress: e.target.value })
		this.props.updateAddress(e.target.value)
	}
	
	render () {
        const {  } = this.props
        const selectValue = ({value}) => {
			return(
			<div className={'add-new-multicrypto-select-value'}>
				<span>
				<FontAwesomeIcon  className={'add-new-multicrypto-select-value-icon'} icon={value.icon} color={value.color}/>
					<span className={'add-new-multicrypto-select-value-text'}>{value.label}</span>
				</span>
			</div>
		)}
		const selectOption = (props) => {
			let option = props.option
			return(
				<div
					onMouseDown={(event) => {
						event.preventDefault();
						event.stopPropagation();	
						props.onSelect(props.option, event)
					}}
					onMouseEnter={(event) => props.onFocus(props.option, event)}
					onMouseMove={(event) => {
							if (props.isFocused) return;
							props.onFocus(props.option, event)
					}}
				>
					<FontAwesomeIcon className={'add-new-multicrypto-select-value-icon'} icon={option.icon} color={option.color}/>
					<span className={'label-spacing-left'}>{option.label}</span>
				</div>
			)}
		return (
		<div className={'add-new-multicrypto-modal'}>
			<div id='comboNetworks' className={'add-new-multicrypto-select'}>
                <Select
					searchable={false}
                    arrowRenderer={() => <div className={'combo-selector-triangle'}></div>}
                    onChange={this.updateNetwork}
                    optionComponent={selectOption}
					options={this.state.networks}
					clearable={false}
                    value={this.state.selectedNetwork}
                    valueComponent={selectValue}
                />
            </div>
            <div id='inputAddress' className={'full-width add-new-multicrypto-input'}>
                <input type='text' placeholder="value" onChange={this.updateAddress}/>
            </div>
		</div>
		)
	}
}

function mapStateToProps (state) {
  	return {
		dispatch: state.dispatch,
	}
}

module.exports = connect(mapStateToProps)(AddNewTokenNetworkAddress)