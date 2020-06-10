import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import {DEFAULT_ICON} from '../../../../constants';

class AddNewChainAddressToResolver extends Component {
  static propTypes = {
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
	}
	updateAddress = (e) => {
		this.setState({ insertedAddress: e.target.value });
	}

	render () {
    const selectValue = ({value}) => {
      const icon = value.icon ? value.icon : DEFAULT_ICON;
      return (
        <div className={''}>
          <span>
          <FontAwesomeIcon className={''} icon={icon.icon} color={icon.color}/>
            <span className={''}>{value.name}</span>
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
          <FontAwesomeIcon className={''} icon={icon.icon} color={icon.color}/>
          <span className={''}>{option.name}</span>
        </div>
      )
    }
		return (
		<div className={''}>
			<div id="comboChainAddresses" className={''}>
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
      <div id="inputAddress" className={''}>
        <input type="text" placeholder="value" onChange={this.updateAddress} />
      </div>
      <button className={''} onClick={() => console.debug('===================== YOU CLICK ON CONFIRM')} >Add Address</button>
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
