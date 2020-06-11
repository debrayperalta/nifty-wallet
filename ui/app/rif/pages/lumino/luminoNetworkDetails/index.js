import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux'

class LuminoNetworkDetails extends Component {

  static propTypes = {
    networkSymbol: PropTypes.string,
  }

  constructor (props) {
    super(props);
    this.state = {}
  }


  // async componentDidMount () {
  //
  // }

  render () {
    const {networkSymbol} = this.props;
    return (
      <div className="body">
        <div>{networkSymbol} Network</div>
      </div>
    );
  }
}

function mapStateToProps (state) {
  // params is the params value or object passed to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {
    currentAddress: state.metamask.selectedAddress.toLowerCase(),
    networkSymbol: params.networkSymbol,
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LuminoNetworkDetails)
