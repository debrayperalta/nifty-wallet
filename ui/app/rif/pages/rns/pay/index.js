import React, {Component} from 'react';
import {connect} from 'react-redux';
import DomainHeader from '../../../components/domain-header';
import PropTypes from 'prop-types';
import NetworkDropdown from '../../../components/networks-dropdown';
import TokenDropdown from '../../../components/tokens-dropdown';
import {SLIP_ADDRESSES} from '../../../constants/slipAddresses';
import rifActions from '../../../actions';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {CallbackHandlers} from '../../../actions/callback-handlers';

class Pay extends Component {

  defaultDecimalSeparator = '.';

  static propTypes = {
    domainInfo: PropTypes.object,
    isOwner: PropTypes.bool,
    decimalSeparator: PropTypes.string,
    sendLuminoPayment: PropTypes.func,
    sendNetworkPayment: PropTypes.func,
    openChannel: PropTypes.func,
    getTokens: PropTypes.func,
    showPopup: PropTypes.func,
    createDeposit: PropTypes.func,
    showWarning: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      tokens: null,
      amount: '',
      destination: '',
      selectedNetwork: null,
      loading: true,
      selectedToken: null,
      deposit: '',
    };
  }

  componentDidMount () {
    if (!this.state.tokens) {
      this.props.getTokens().then(tokens => {
        this.setState({
          tokens,
          selectedNetwork: this.getAllowedNetworks()[0],
          selectedToken: tokens[0],
          loading: false,
        });
      });
    }
  }

  getAllowedNetworks () {
    return SLIP_ADDRESSES.filter(network => {
      return network.symbol === 'ETH' || network.symbol === 'RBTC';
    });
  }

  getAllowedTokens () {
    return this.state.tokens;
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

  onTokenChange (selectedToken) {
    this.setState({
      selectedToken,
    });
  }

  validateAmount (event) {
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

  sendNetworkPayment () {
    this.props.sendNetworkPayment(this.state.selectedNetwork, this.state.destination, this.state.amount);
  }

  sendLuminoPayment () {
    const callbackHandlers = new CallbackHandlers();
    callbackHandlers.successHandler = (result) => {
      console.log('PAYMENT DONE!!!', result);
    };
    this.props.sendLuminoPayment(this.state.selectedToken, this.state.destination, this.state.amount, callbackHandlers);
  }

  checkNetworkPaymentReady () {
    return this.state.amount && this.state.destination && this.state.selectedNetwork;
  }

  checkLuminoPaymentReady () {
    return this.state.amount && this.state.destination && this.state.selectedToken
  }

  readyToPay () {
    switch (this.state.tabIndex) {
      case '1':
        return this.checkNetworkPaymentReady();
      case '2':
        return this.checkLuminoPaymentReady();
      default:
        return this.checkNetworkPaymentReady();
    }
  }

  onTabChange (index) {
    this.setState({
      tabIndex: index,
      selectedToken: this.getAllowedTokens()[0],
      selectedNetwork: this.getAllowedNetworks()[0],
      amount: '',
      destination: '',
    });
  }

  tokenHasChannelOpened () {
    if (this.state.selectedToken) {
      return this.state.selectedToken.joined ? this.state.selectedToken.joined : false;
    }
    return false;
  }

  getTokenFragment (destination) {
    let tokenDropdown = null;

    if (!this.state.loading) {
      tokenDropdown = (
        <TokenDropdown onSelectedToken={(selectedToken) => this.onTokenChange(selectedToken)}
                       defaultSelectedToken={this.getAllowedTokens()[0]}
                       tokens={this.getAllowedTokens()}/>
      );
    }

    if (this.tokenHasChannelOpened()) {
      return (
        <div>
          {tokenDropdown}
          <div>
            <div className="form-segment">
              <span>Amount:</span><input type="text" onKeyDown={event => this.validateAmount(event)} onChange={event => this.changeAmount(event)} />
            </div>
            {destination}
            <div className="form-segment">
              <button onClick={() => this.depositOnChannel()}>Deposit</button>
              <button disabled={!this.readyToPay()} onClick={() => this.sendLuminoPayment()}>Pay</button>
            </div>
          </div>
        </div>
      );
    } else {
      // we show a message that the user need to open channels on this particular token
      return (
        <div>
          {tokenDropdown}
          <div className="open-channel-message">
            <div>
              You need to open a channel with this token before you can pay with it
            </div>
          </div>
          <div className="open-channel-button">
            <button onClick={() => this.openChannel()}>Open Channel</button>
          </div>
        </div>
      );
    }
  }

  depositOnChannel () {
    const callbackHandlers = new CallbackHandlers();
    callbackHandlers.requestHandler = (result) => {
      this.props.getTokens().then(tokens => {
        this.setState({
          tokens,
        });
      });
    };
    callbackHandlers.successHandler = (result) => {
      console.log('DEPOSIT CREATED!!!', result);
    };
    callbackHandlers.errorHandler = (error) => {
      this.props.showWarning(error);
    };
    const elements = [
      (<input key="partner-input" type="text" placeholder="Partner Address" onChange={(event) => {
        const destination = event.target.value;
        if (destination) {
          this.setState({
            destination,
          });
        }
      }} />),
      (<input key="deposit-input" type="text" placeholder="Deposit Amount" onKeyDown={event => this.validateAmount(event)} onChange={(event) => {
        const deposit = event.target.value;
        if (deposit) {
          this.setState({
            deposit,
          });
        }
      }} />),
    ];
    this.props.showPopup('Deposit on Channel', {
      elements,
      confirmLabel: 'Deposit',
      confirmCallback: () => {
        console.log('Token', this.state.selectedToken);
        console.log('Deposit', this.state.deposit);
        console.log('Destination', this.state.destination);
      },
    });
  }

  openChannel () {
    const callbackHandlers = new CallbackHandlers();
    callbackHandlers.requestHandler = (result) => {
      this.props.getTokens().then(tokens => {
        this.setState({
          tokens,
        });
      });
    };
    callbackHandlers.successHandler = (result) => {
      console.log('OPEN CHANNEL!!!', result);
      // TODO: this only will work with notifiers, we should move any logic after open channel to here instead of asuming that open channel was success
    };
    callbackHandlers.errorHandler = (error) => {
      this.props.showWarning(error);
    };
    const elements = [
      (<input key="partner-input" type="text" placeholder="Partner Address" onChange={(event) => {
        const destination = event.target.value;
        if (destination) {
          this.setState({
            destination,
          });
        }
      }} />),
    ];
    this.props.showPopup('Open Channel', {
      elements,
      confirmLabel: 'Open',
      confirmCallback: () => {
        if (this.state.destination) {
          this.props.openChannel(this.state.destination, this.state.selectedToken, callbackHandlers);
        }
      },
    });
  }

  render () {
    const header = this.getHeaderFragment();
    const destination = this.getDestinationFragment();
    const tokenFragment = this.getTokenFragment(destination);
    return (
      <div className="body">
        {header}
        <Tabs onSelect={(index) => this.onTabChange(index)}>
          <TabList>
            <Tab tabIndex="1">Pay</Tab>
            <Tab tabIndex="2">Pay with Lumino</Tab>
          </TabList>

          <TabPanel>
            <NetworkDropdown onSelectedNetwork={(selectedNetwork => this.onNetworkChange(selectedNetwork))}
                             defaultSelectedNetwork={this.getAllowedNetworks()[0]}
                             networks={this.getAllowedNetworks()}/>
            <div className="form-segment">
              <span>Amount:</span><input type="text" onKeyDown={event => this.filterInput(event)} onChange={event => this.changeAmount(event)} />
            </div>
            {destination}
            <div className="form-segment">
              <button disabled={!this.readyToPay()} onClick={() => this.sendNetworkPayment()}>Send</button>
            </div>
          </TabPanel>
          <TabPanel>
            {tokenFragment}
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
    sendLuminoPayment: (token, destination, amount, callbackHandlers) => {
      return dispatch(rifActions.createPayment(destination, token.address, amount, callbackHandlers));
    },
    sendNetworkPayment: (network, destination, amount) => {
      console.log('Network Payment', {network, destination, amount});
    },
    openChannel: (partner, token, callbackHandlers) => {
      return dispatch(rifActions.openChannel(partner, token.address, callbackHandlers))
    },
    createDeposit: (partner, token, channelId, amount, callbackHandlers) => {
      return dispatch(rifActions.createDeposit(partner, token.address, null, token.token_network_address, channelId, amount, callbackHandlers))
    },
    getTokens: () => dispatch(rifActions.getTokensWithJoinedCheck()),
    showPopup: (title, opts) => {
      dispatch(rifActions.showModal({
        title,
        ...opts,
      }));
    },
  }
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Pay)
