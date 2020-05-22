import React, {Component} from 'react';
import {connect} from 'react-redux';
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';
import { tokenIcons } from '../../../constants/icons';
import {Menu} from '../../../components';

class LuminoTokenDetailPage extends Component {
  static propTypes = {
    token: PropTypes.object,
    showThis: PropTypes.func,
    getChannels: PropTypes.func,
  }

  render () {
    const { token } = this.props;
    if (token) {
      return (<div className={'body'}>
        Token
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
    token: params,
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
