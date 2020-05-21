import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pageNames} from '../../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import { tokenIcons, brandConnections, DEFAULT_ICON } from '../../../constants/icons';
import {Menu} from '../../../components';

const PATH_TO_RIF_IMAGES = '/images/rif/';

class ExplorerPage extends Component {
  static propTypes = {
    tokens: PropTypes.array,
    channels: PropTypes.array,
    showThis: PropTypes.func,
    getTokens: PropTypes.func,
    getChannels: PropTypes.func,
  }
  async componentDidMount () {
    if (!this.props.tokens) {
      let channels = [];
      let tokens = [];
      try {
        tokens = await this.props.getTokens();
        channels = await this.props.getChannels();
      } catch (e) {

      }

      if (tokens && channels) {
        this.props.showThis({
          ...this.props,
          tokens,
          channels,
        })
      }
    }
  }
  render () {
    const { tokens } = this.props;
    const chiplet = (token, joined, index) => {
      const icon = tokenIcons[token.name.toLowerCase()];
      return <div key={index} className={'token-chiplet align-left'}>
        <div id="Logo" className={'token-logo align-left'}>
          {icon ?
            <img src={PATH_TO_RIF_IMAGES + icon.icon} className={'token-logo-png'}/>
            :
            <FontAwesomeIcon icon={DEFAULT_ICON.icon} color={DEFAULT_ICON.color} className={'token-logo-icon'}/>
          }
        </div>
        <div id="TokenName" className={'token-name align-left'}>
          {token.name}
        </div>
        <div id="TokenInfo" className={'token-info align-right'}>
          <div id="TokenChannels" className={'token-info-channels align-right'}>
            <div className={'token-info-channels-icon align-left'}>
              <FontAwesomeIcon icon={brandConnections.icon} color={brandConnections.color} />
            </div>
            <div className={'token-info-channels-channels align-right'}>{token.channels.length}</div>
          </div>
          <div id="TokenStatus" className={'token-info-status align-right ' + (joined ? 'token-info-status-joined' : 'token-info-status-unjoined')}>
            {joined ? 'JOINED' : 'NOT JOINED'}
          </div>
        </div>
      </div>
    }
    if (tokens) {
      return (<div className={'body'}>
        {tokens.map((token, index) => {
          const joined = this.props.channels.find(channel => channel.token_address === token.address);
          return chiplet(token, joined, index);
        })}
        <Menu />
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
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.luminoExplorer, params)),
    getTokens: () => dispatch(rifActions.getTokens()),
    getChannels: () => dispatch(rifActions.getChannels()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExplorerPage)
