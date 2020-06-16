import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import {DEFAULT_ICON} from '../../../../constants';

class AddNewChainAddressToResolver extends Component {
  static propTypes = {
    slipChainAddresses: PropTypes.array.isRequired,
    confirmCallback: PropTypes.func.isRequired,
    updateChainAddress: PropTypes.func.isRequired,
    updateAddress: PropTypes.func.isRequired,
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
    this.props.updateChainAddress(selectedOption.chain);
	}
	updateAddress = (e) => {
		this.setState({ insertedAddress: e.target.value });
    this.props.updateAddress(e.target.value);
	}

	render () {
    const selectValue = ({value}) => {
      const icon = value.icon ? value.icon : DEFAULT_ICON;
      return (
        <div>
          <span>
          <FontAwesomeIcon icon={icon.icon} color={icon.color}/>
            <span>{value.name}</span>
          </span>
        </div>
      )
    }
    const selectOption = (props) => {
      const { option } = props;
      const icon = option.icon ? option.icon : DEFAULT_ICON;
      return (
        <div
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            props.onSelect(option, event);
          }}
          onMouseEnter={(event) => props.onFocus(option, event)}
          onMouseMove={(event) => {
              if (props.isFocused) return;
              props.onFocus(option, event)
          }}
        >
          <FontAwesomeIcon icon={icon.icon} color={icon.color}/>
          <span>{option.name}</span>
        </div>
      )
    }
		return (
		<div>
			<div id="comboChainAddresses">
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
      <div id="inputAddress">
        <input type="text" placeholder="value" onChange={this.updateAddress} />
      </div>
      <button onClick={() => this.props.confirmCallback() } >Add Address</button>
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
