import React, {Component} from 'react';
import {connect} from 'react-redux';
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import Token from '../../../classes/token';
import {Channels, JoinedChip, Logo, ChannelChiplet} from '../../../components';
import {tokenIcons} from '../../../constants';

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
    getDomainByAddress: PropTypes.func,
    joinNetwork: PropTypes.func,
    leaveNetwork: PropTypes.func,
  }
  render () {
    const { token } = this.props;
    const icon = tokenIcons[token.symbol.toLowerCase()];
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
              {token.userBalance || 0} {token.symbol}
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
            <div>
              <span>
                You don't have any channel on this network
              </span>
              <div className={'join-network-button'} onClick={() => this.props.joinNetwork()}>JOIN NETWORK</div>
            </div>
          }
          {
            token.userChannels &&
              <div>
                {token.userChannels.map((channel, index) => {
                return (
                  <ChannelChiplet key={index} address={channel.partner_address} balance={channel.balance} status={channel.sdk_status} symbol={token.symbol} />
                )
              })}
                <div className={'leave-network-button'} onClick={() => this.props.leaveNetwork()}>LEAVE NETWORK</div>
              </div>
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
  const token = new Token(params.name, params.symbol, params.address, params.channels, params.openedChannels, params.network_address, params.joined, params.userBalance);
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
    getDomainByAddress: (address) => dispatch(rifActions.getDomainByAddress(address)),
    joinNetwork: () => {},
    leaveNetwork: () => {},
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoTokenDetailPage)
