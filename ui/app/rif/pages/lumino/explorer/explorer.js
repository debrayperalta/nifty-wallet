import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pageNames} from '../../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import { tokenIcons, brandConnections, DEFAULT_ICON } from '../../../constants/icons';

class ExplorerPage extends Component {
  static propTypes = {
    tokens: PropTypes.array,
    showThis: PropTypes.func,
    getTokens: PropTypes.func,
  }
  async componentDidMount () {
    if (!this.props.tokens) {
      const tokens = await this.props.getTokens();
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
      const icon = tokenIcons[token.name.toLowerCase()];
      return <div key={index} className={'token-chiplet align-left'}>
        <div id="Logo" className={'token-logo align-left'}>
          {icon ?
            icon.icon
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
            <div className={'token-info-channels-channels align-left'}>{token.channels.length}</div>
          </div>
          <div id="TokenStatus" className={'token-info-status align-right ' + (joined ? 'token-info-status-joined' : 'token-info-status-unjoined')}>
            {joined ? 'JOINED' : 'NOT JOINED'}
          </div>
        </div>
      </div>
    }
    let joinedConst = false;
    if (tokens) {
      return (<div className={'body'}>
        {tokens.map((token, index) => {
          joinedConst = !joinedConst;
          return chiplet(token, joinedConst, index);
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
    showThis: (params) => dispatch(rifActions.navigateTo(pageNames.rns.luminoExplorer, params)),
    getTokens: () => dispatch(rifActions.getTokens()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ExplorerPage)
