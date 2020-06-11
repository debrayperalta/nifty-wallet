import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {validateDecimalAmount} from '../../../utils/validations';
import rifActions from '../../../actions';
import {CallbackHandlers} from '../../../actions/callback-handlers';
import niftyActions from '../../../../actions';

class OpenChannel extends Component {

  static propTypes = {
    tokenAddress: PropTypes.string.isRequired,
    tokenNetworkAddress: PropTypes.string.isRequired,
    tokenName: PropTypes.string.isRequired,
    tokenSymbol: PropTypes.string.isRequired,
    openChannel: PropTypes.func,
    showToast: PropTypes.func,
    showPopup: PropTypes.func,
    createDeposit: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      destination: null,
      opened: false,
      amount: null,
    };
  }

  changeDestination (event) {
    const destination = event.target.value;
    this.setState({
      destination,
    });
  }

  changeAmount (event) {
    const amount = event.target.value;
    this.setState({
      amount,
    });
  }

  validateAmount (event) {
    return validateDecimalAmount(event, this.state.amount);
  }

  getBody () {
    return (
      <div>
        <div className="form-segment">
          <input className="domain-address-input" type="text" placeholder="Enter address / domain" onChange={(event) => this.changeDestination(event)}/>
          <span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="3.5" width="9" height="9" stroke="#979797"/>
              <path d="M1 5V1H5" stroke="#979797"/>
              <path d="M15 11L15 15L11 15" stroke="#979797"/>
              <path d="M11 1L15 1L15 5" stroke="#979797"/>
              <path d="M5 15L1 15L1 11" stroke="#979797"/>
            </svg>
          </span>
        </div>
        <div className="form-segment">
          <input className="amount-input"
                 type="text"
                 placeholder={this.props.tokenSymbol + ' Amount'}
                 onKeyDown={event => this.validateAmount(event)}
                 onChange={event => this.changeAmount(event)} />
        </div>
        <div className="form-segment">
          <button className="btn-primary" disabled={!this.readyToOpenChannel()} onClick={() => this.openChannelRequest()}>Add</button>
        </div>
      </div>
    );
  }

  readyToOpenChannel () {
    return this.state.destination;
  }

  async openChannelRequest () {
    const callbackHandlers = new CallbackHandlers();
    callbackHandlers.requestHandler = (result) => {
      console.debug('OPEN CHANNEL REQUESTED', result);
      this.props.showToast('Requesting Open Channel');
    };
    callbackHandlers.successHandler = async (result) => {
      console.debug('CHANNEL OPENED', result);
      this.props.showToast('Channel Opened Successfully!');
      if (this.state.amount) {
        const depositCallbackHandlers = new CallbackHandlers();
        depositCallbackHandlers.requestHandler = (result) => {
          console.debug('DEPOSIT REQUESTED', result);
          this.props.showToast('Deposit Requested');
        };
        depositCallbackHandlers.successHandler = (result) => {
          console.debug('DEPOSIT DONE', result);
          this.props.showToast('Deposit Done Successfully');
        };
        depositCallbackHandlers.errorHandler = (result) => {
          console.debug('DEPOSIT ERROR', result);
          const errorMessage = result.response.data.errors;
          if (errorMessage) {
            this.props.showToast(errorMessage, false);
          } else {
            this.props.showToast('Unknown Error Trying to Deposit');
          }
        };
        // TODO: we need to change this to get the channel identifier from the channel result.
        const channelIdentifier = '1';

        // we need to deposit
        this.props.showToast(`Trying to deposit ${this.state.amount} ${this.props.tokenName} on channel ${channelIdentifier}`);

        await this.props.createDeposit(
          this.state.destination,
          this.props.tokenAddress,
          this.props.tokenNetworkAddress,
          channelIdentifier,
          this.state.amount,
          depositCallbackHandlers);
      }
    };
    callbackHandlers.errorHandler = (result) => {
      console.debug('OPEN CHANNEL ERROR', result);
      const errorMessage = result.response.data.errors;
      if (errorMessage) {
        this.props.showToast(errorMessage, false);
      } else {
        this.props.showToast('Unknown Error trying to open channel!', false);
      }
    };
    this.props.showPopup('Open Channel', {
      text: 'Are you sure you want to open channel with partner ' + this.state.destination + ' using token ' + this.props.tokenName + '?',
      confirmCallback: async () => {
        if (this.state.destination) {
          await this.props.openChannel(this.state.destination, this.props.tokenAddress, callbackHandlers);
        } else {
          this.props.showToast('You need to select a token and put the partner and amount first.', false);
        }
      },
    });
  }

  open () {
    this.setState({
      opened: !this.state.opened,
    });
  }

  render () {
    const body = this.state.opened ? this.getBody() : null;
    return (
      <div>
        <div className="form-segment">
          <span onClick={() => this.open()}>+ Add channel</span>
        </div>
        {body}
      </div>
    );
  }
}

function mapDispatchToProps (dispatch) {
  return {
    openChannel: (partner, tokenAddress, callbackHandlers) => dispatch(rifActions.openChannel(partner, tokenAddress, callbackHandlers)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
    showPopup: (title, opts) => {
      dispatch(rifActions.showModal({
        title,
        ...opts,
      }));
    },
    createDeposit: (partner, tokenAddress, tokenNetworkAddress, channelIdentifier, amount, callbackHandlers) =>
      dispatch(rifActions.createDeposit(partner, tokenAddress, tokenNetworkAddress, channelIdentifier, amount, callbackHandlers)),
  };
}

module.exports = connect(null, mapDispatchToProps)(OpenChannel)
