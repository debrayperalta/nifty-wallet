import React, {Component} from 'react'
import {connect} from 'react-redux'

class PaymentsScreen extends Component {
  navigateTo (url) {
    global.platform.openWindow({ url })
  }
  render () {
    return (<div>Payments Page</div>);
  }
}
function mapStateToProps (state) {
  return {dispatch: state.dispatch}
}
module.exports = connect(mapStateToProps)(PaymentsScreen)
