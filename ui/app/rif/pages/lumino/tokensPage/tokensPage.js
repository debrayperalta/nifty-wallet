import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import { tokenIcons } from '../../../constants/icons';
import { Logo, Channels, JoinedChip } from '../../../components';

const classNames = {
  Logo: {
    tokenLogo: 'token-logo align-left',
    tokenLogoPng: 'token-logo-png',
    tokenLogoIcon: 'token-logo-icon',
  },
  Channels: {
    tokenInfoChannels: 'token-info-channels align-right',
    tokenInfoChannelsIcon: 'token-info-channels-icon align-left',
    tokenInfoChannelsQty: 'token-info-channels-qty align-right',
  },
  JoinedChip: {
    tokenInfoStatus: 'token-info-status align-right ',
    tokenInfoStatusJoined: 'token-info-status-joined',
    tokenInfoStatusUnJoined: 'token-info-status-unjoined',
  },
}

class LuminoTokensPage extends Component {
  static propTypes = {
    tokens: PropTypes.array,
    showThis: PropTypes.func,
    getTokensWithJoinedCheck: PropTypes.func,
    showTokenDetail: PropTypes.func,
  }
  async componentDidMount () {
    if (!this.props.tokens) {
      let tokens = [];
      try {
        tokens = await this.props.getTokensWithJoinedCheck();
      } catch (e) {

      }
      if (tokens) {
        this.props.showThis({
          ...this.props,
          tokens,
        })
      }
    }
  }
  render () {
    const { tokens } = this.props;
    const chiplet = (token, joined, index) => {
      const icon = tokenIcons[token.symbol.toLowerCase()];
      return <div key={index} className={'token-chiplet align-left'}>
        {Logo(classNames.Logo, icon)}
        <div id="TokenSymbol" className={'token-symbol align-left'} onClick={() => this.props.showTokenDetail(token)}>
          {token.symbol}
        </div>
        <div id="TokenInfo" className={'token-info align-right'}>
          {Channels(classNames.Channels, token.channels.length)}
          {JoinedChip(classNames.JoinedChip, joined)}
        </div>
      </div>
    }
    if (tokens) {
      return (<div className={'body'}>
        {tokens.map((token, index) => {
          return chiplet(token, token.joined || false, index);
        })}
      </div>)
    } else {
      return (<div>Loading tokens...</div>);
    }
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    dispatch: state.dispatch,
    ...params,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.luminoTokensPage, params)),
    getTokensWithJoinedCheck: () => dispatch(rifActions.getTokensWithJoinedCheck()),
    showTokenDetail: (params) => dispatch(rifActions.navigateTo(pageNames.rns.luminoTokenDetailPage, params)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoTokensPage)
