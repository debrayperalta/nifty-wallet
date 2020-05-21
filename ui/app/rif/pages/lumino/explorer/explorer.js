import React, {Component} from 'react'
import {connect} from 'react-redux'
import {pageNames} from '../../index';
import rifActions from '../../../actions';
import PropTypes from 'prop-types';

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
      return (<div>Loading tokens...</div>);
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
