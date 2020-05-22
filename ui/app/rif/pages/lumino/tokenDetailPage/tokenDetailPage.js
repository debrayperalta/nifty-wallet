import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pageNames} from '../../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import { tokenIcons, brandConnections, DEFAULT_ICON } from '../../../constants/icons';
import { PATH_TO_RIF_IMAGES } from '../../../constants';
import {Menu} from '../../../components';

class LuminoTokenDetailPage extends Component {
  static propTypes = {
    token: PropTypes.object,
    channels: PropTypes.array,
    showThis: PropTypes.func,
    getChannels: PropTypes.func,
  }

  render () {
    const { token } = this.props;
    if (token) {
      return (<div className={'body'}>
        Token
        <Menu />
      </div>)
    } else {
      return (<div>Loading token detail...</div>);
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
    getChannels: () => dispatch(rifActions.getChannels()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LuminoTokenDetailPage)
