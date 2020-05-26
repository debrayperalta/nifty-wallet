import React, {Component} from 'react';
import {connect} from 'react-redux';
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import Token from '../../../classes/token';
import { Logo, Channels, JoinedChip, ChannelStatusChip } from '../../../components';
import { tokenIcons } from '../../../constants';
import { getStatusForChannel } from '../../../utils/utils'

const mockChannels = {
  '2-0xa00a2145d01EaCd500E6e196296839D0E4b8654D': {
    'total_deposit': 0,
    'settle_timeout': 500,
    'token_address': '0xa00a2145d01EaCd500E6e196296839D0E4b8654D',
    'balance': 0,
    'reveal_timeout': 50,
    'partner_address': '0x64170130Af2E2e638C01a9492f8268D0E28e3233',
    'token_network_identifier': '0x4202D38Cde22C666C1A021B2bA1e6b5F65cbe0bA',
    'state': 'opened',
    'channel_identifier': 2,
    'token_symbol': 'OG',
    'token_name': 'OmniGel',
    'sdk_status': 'CHANNEL_OPENED',
    'offChainBalance': '0',
    'receivedTokens': '0',
    'sentTokens': '0',
    'votes': {
      'open': {

      },
      'close': {

      },
    },
  },
  '2-0xA850E59b0b9Da8c76D37029bC6A6373edebD3C4b': {
    'total_deposit': 0,
    'settle_timeout': 500,
    'token_address': '0xA850E59b0b9Da8c76D37029bC6A6373edebD3C4b',
    'balance': 0,
    'reveal_timeout': 50,
    'partner_address': '0x64170130Af2E2e638C01a9492f8268D0E28e3233',
    'token_network_identifier': '0x1aE0bdec5d5cC81cD18b1567a63460769F188836',
    'state': 'opened',
    'channel_identifier': 2,
    'token_symbol': 'UYU',
    'token_name': 'YoruguaToken',
    'sdk_status': 'CHANNEL_OPENED',
    'offChainBalance': '0',
    'receivedTokens': '0',
    'sentTokens': '0',
    'votes': {
      'open': {

      },
      'close': {

      },
    },
  },
  '1-0x0319b08220f83EAD273cC09531f6d0F96269b5bF': {
    'total_deposit': 0,
    'settle_timeout': 500,
    'token_address': '0x0319b08220f83EAD273cC09531f6d0F96269b5bF',
    'balance': 0,
    'reveal_timeout': 50,
    'partner_address': '0x64170130Af2E2e638C01a9492f8268D0E28e3233',
    'token_network_identifier': '0x07adc7b6A303575b78617c0AF351B19759A5404e',
    'state': 'opened',
    'channel_identifier': 1,
    'token_symbol': 'PESO',
    'token_name': 'PesoToken',
    'sdk_status': 'CHANNEL_OPENED',
    'offChainBalance': '0',
    'receivedTokens': '0',
    'sentTokens': '0',
    'votes': {
      'open': {

      },
      'close': {

      },
    },
  },
}

const classNames = {
  Logo: {
    tokenLogo: 'token-logo align-left',
    tokenLogoPng: 'token-logo-png',
    tokenLogoIcon: 'token-logo-icon',
  },
  Channels: {
    tokenInfoChannels: 'token-general-info-channels align-right',
    tokenInfoChannelsIcon: 'token-info-channels-icon align-left',
    tokenInfoChannelsQty: 'token-info-channels-qty align-right',
  },
  JoinedChip: {
    tokenInfoStatus: 'token-general-info-status ',
    tokenInfoStatusJoined: 'token-info-status-joined',
    tokenInfoStatusUnJoined: 'token-info-status-unjoined',
  },
}

class LuminoTokenDetailPage extends Component {
  static propTypes = {
    token: PropTypes.object,
    showThis: PropTypes.func,
    getChannels: PropTypes.func,
  }

  render () {
    const { token } = this.props;
    const icon = tokenIcons[token.symbol.toLowerCase()];
    // TODO: Rodrigo
    // Resolve address with RNS
    const channelChiplet = (index, balance, status, tokenSymbol) =>
      <div key={index} className={'channels-info-chiplet'}>
        <div className={'channels-info-chiplet-text'}>
          <div className={'channels-info-chiplet-text-domain'}>Pixel.rsk</div>
          <div className={'channels-info-chiplet-text-balance'}>Your balance: <span>{balance} {tokenSymbol}</span></div>
        </div>
        <div className={'channels-info-chiplet-status'}>
          <div>{ChannelStatusChip(getStatusForChannel(status))}</div>
        </div>
      </div>
    if (token) {
      return (<div className={'body'}>
        <div id="TokenDescription" className={'token-description align-left'} >
          {Logo(classNames.Logo, icon)}
          <div id="TokenNameDesc" className={'token-name-desc align-left'}>
            <div id="TokenSymbol" className={'token-name-desc-symbol align-left'}>
              {token.symbol}
            </div>
            <div id="TokenName" className={'token-name-desc-name align-left'}>
              {token.name}
            </div>
          </div>
          <div id="TokenDeposit" className={'token-deposit align-left'}>
            <div id="TokenSymbol" className={'token-deposit-text align-right'}>
              0.000005 BTC
            </div>
            <div id="TokenName" className={'token-deposit-text align-right'}>
              1 USD
            </div>
          </div>
          <div id="TokenGeneralInfo" className={'token-general-info align-left'}>
            <div id="TokenGeneralInfoChannels" className={'token-general-info-chiplet'}>
              {
                Channels(classNames.Channels, token.networkChannels.length)
              }
            </div>
            <div id="TokenGeneralInfoChannels" className={'token-general-info-chiplet'}>
              {
                JoinedChip(classNames.JoinedChip, token.joined)
              }
            </div>
            <div id="TokenGeneralInfoChannels" className={'token-general-info-chiplet'}>
              <div className={'token-general-info-chiplet-channel-new'} onClick={() => {}}>
                NEW
              </div>
            </div>
          </div>
        </div>
        <div id="ChannelsInfo" className={'channels-info'}>
          {
            !token.userChannels &&
              <span>
                You don't have any channel on this network
              </span>
          }
          {
            token.userChannels &&
            token.userChannels.map((channel, index) => {
              return (
                channelChiplet(index, channel.balance, channel.sdk_status, token.symbol)
              )
            })
          }
        </div>
      </div>)
    } else {
      return (<div>Loading token detail...</div>);
    }
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  // Todo: Rodrigo
  // Cant make work the SDK to get channels, mocking to continue working
  // const token = new Token(params.name, params.symbol, params.address, params.channels, params.openedChannels, params.network_address, params.joined);
  const userChannels = Object.keys(mockChannels).map(channelKey => mockChannels[channelKey]);
  const token = new Token(params.name, params.symbol, params.address, params.channels, userChannels, params.network_address, params.joined);
  return {
    dispatch: state.dispatch,
    token: token,
    ...params,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.luminoTokensPage, params)),
    getChannels: () => dispatch(rifActions.getChannels()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoTokenDetailPage)
