import React, {Component} from 'react'
import {connect} from 'react-redux'

class SellOnMKP extends Component {

  static propTypes = {}

  render () {
    return (<div>SellOnMKP</div>);
  }
}
function mapStateToProps (state) {
  // params is the params value or object passet to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SellOnMKP)
