import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import {DEFAULT_ICON} from '../../../constants';

class AddNewChainAddressToResolver extends Component {
  static propTypes = {
    updateChainAddress: PropTypes.func.isRequired,
    updateAddress: PropTypes.func.isRequired,
    slipChainAddresses: PropTypes.array.isRequired,
    option: PropTypes.object,
  }
  constructor(props) {
    super(props);
    const slipChainAddresses = [...props.slipChainAddresses];
    this.state = {
      slipChainAddresses: slipChainAddresses,
      selectedChainAddress: slipChainAddresses[0],
      insertedAddress: '',
    };
	}
  updateChainAddress = (selectedOption) => {
		this.setState({ selectedChainAddress: selectedOption });
		this.props.updateChainAddress(selectedOption);
	}
	updateAddress = (e) => {
		this.setState({ insertedAddress: e.target.value });
		this.props.updateAddress(e.target.value);
	}

	render () {
    const selectValue = ({value}) => {
      const icon = value.icon ? value.icon : DEFAULT_ICON;
      return (
        <div className={'add-new-multicrypto-select-value'}>
          <span>
          <FontAwesomeIcon className={'add-new-multicrypto-select-value-icon'} icon={icon.icon} color={icon.color}/>
            <span className={'add-new-multicrypto-select-value-text'}>{value.name}</span>
          </span>
        </div>
      )
    }
    const selectOption = (props) => {
      const { option } = props;
      console.debug('Option', option);
      const icon = option.icon ? option.icon : DEFAULT_ICON;
      return (
        <div
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            props.onSelect(option, event)
          }}
          onMouseEnter={(event) => props.onFocus(option, event)}
          onMouseMove={(event) => {
              if (props.isFocused) return;
              props.onFocus(option, event)
          }}
        >
          <FontAwesomeIcon className={'add-new-multicrypto-select-value-icon'} icon={icon.icon} color={icon.color}/>
          <span className={'label-spacing-left'}>{option.name}</span>
        </div>
      )
    }
		return (
		<div className={'add-new-multicrypto-modal'}>
			<div id="comboChainAddresses" className={'add-new-multicrypto-select'}>
        <Select
					searchable={false}
          arrowRenderer={() => <div className={'combo-selector-triangle'}></div>}
          onChange={this.updateChainAddress}
          optionComponent={selectOption}
					options={this.state.slipChainAddresses}
					clearable={false}
          value={this.state.selectedChainAddress}
          valueComponent={selectValue}
        />
      </div>
      <div id="inputAddress" className={'full-width add-new-multicrypto-input'}>
        <input type="text" placeholder="value" onChange={this.updateAddress} />
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

module.exports = connect(mapStateToProps)(AddNewChainAddressToResolver)
