import React, {Component} from 'react'
import {connect} from 'react-redux'

class Pay extends Component {

  static propTypes = {}

  render () {
    return (<div>Pay</div>);
  }
}
function mapStateToProps (state) {
  // params is the params value or object passed to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {}
}

function mapDispatchToProps (dispatch) {
  return {}
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Pay)
