import React, {Component} from 'react';
import {connect} from 'react-redux';
import DomainHeader from '../../../components/domain-header';
import PropTypes from 'prop-types';
import NetworkDropdown from '../../../components/networks-dropdown';
import {SLIP_ADDRESSES} from '../../../constants/slipAddresses';
import rifActions from '../../../actions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Pay extends Component {

  defaultDecimalSeparator = '.';

  constructor (props) {
    super(props);
    this.state = {
      amount: '',
      destination: '',
      network: null,
    };
  }

  static propTypes = {
    domainInfo: PropTypes.object,
    isOwner: PropTypes.bool,
    decimalSeparator: PropTypes.string,
    sendPayment: PropTypes.func,
  }

  getAllowedNetworks () {
    return SLIP_ADDRESSES.filter(network => {
      return network.symbol === 'ETH' || network.symbol === 'RBTC';
    });
  }

  getHeaderFragment () {
    if (this.props.domainInfo) {
      const domainInfo = this.props.domainInfo;
      return (
        <DomainHeader domainName={domainInfo.domainName}
                      showOwnerIcon={domainInfo.isOwner}
                      showLuminoNodeIcon={domainInfo.isLuminoNode}
                      showRifStorageIcon={domainInfo.isRifStorage}/>
      );
    }
  }

  getDestinationFragment () {
    if (!this.props.domainInfo) {
      return (
        <div className="form-segment">
          <span>Destination:</span><input type="text" placeholder="Address or RNS Domain" onChange={event => this.changeDestination(event)} />
        </div>
      );
    }
  }

  onNetworkChange (selectedNetwork) {
    this.setState({
      selectedNetwork,
    });
  }

  filterInput (event) {
    const keyCode = event.keyCode;
    const key = event.key;
    const decimalSeparator = this.props.decimalSeparator ? this.props.decimalSeparator : this.defaultDecimalSeparator;
    const isValidNumber = key === decimalSeparator ||
      (keyCode >= 96 && keyCode <= 105) || // numpad numbers
      (keyCode >= 48 && keyCode <= 59) || // keyboard numbers
      keyCode === 8; // backspace
    if (!isValidNumber) {
      // if it's not a valid number we block
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    if (key === decimalSeparator) {
      const currentAmount = this.state.amount ? this.state.amount : '';
      // if we have already a decimal separator we block
      if (currentAmount.indexOf(decimalSeparator) !== -1) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }

  changeAmount (event) {
    const amount = event.target.value;
    this.setState({
      amount,
    });
  }

  changeDestination (event) {
    const destination = event.target.value;
    this.setState({
      destination,
    });
  }

  sendPayment () {
    this.props.sendPayment({
      network: this.state.selectedNetwork,
      amount: this.state.amount,
      destination: this.state.destination,
    });
  }

  render () {
    const header = this.getHeaderFragment();
    const destination = this.getDestinationFragment();
    return (
      <div className="body">
        {header}
        <Tabs>
          <TabList>
            <Tab>Pay</Tab>
            <Tab>Pay with Lumino</Tab>
          </TabList>

          <TabPanel>
            <NetworkDropdown onSelectedNetwork={this.onNetworkChange}
                             defaultSelectedNetwork={this.getAllowedNetworks()[0]}
                             networks={this.getAllowedNetworks()}/>
            <div className="form-segment">
              <span>Amount:</span><input type="text" onKeyDown={event => this.filterInput(event)} onChange={event => this.changeAmount(event)} />
            </div>
            {destination}
            <div className="form-segment">
              <button onClick={() => this.sendPayment()}>Send</button>
            </div>
          </TabPanel>
          <TabPanel>
            TOKEN DROPDOWN
            <div className="form-segment">
              <span>Amount:</span><input type="text" onKeyDown={event => this.filterInput(event)} onChange={event => this.changeAmount(event)} />
            </div>
            {destination}
            <div className="form-segment">
              <button onClick={() => this.sendPayment()}>Send</button>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    domainInfo: params.domainInfo,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    sendPayment: (params) => {
      const {destination, tokenAddress, amount} = params;
      return dispatch(rifActions.createPayment(destination, tokenAddress, amount));
    },
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Pay)
