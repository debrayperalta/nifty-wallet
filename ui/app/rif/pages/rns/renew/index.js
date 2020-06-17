import React, {Component} from 'react'
import {connect} from 'react-redux'
import DepositOnChannel from '../../../components/lumino/deposit-on-channel';
import OpenChannel from '../../../components/lumino/open-channel';
import CloseChannel from '../../../components/lumino/close-channel';

class Renew extends Component {

  static propTypes = {}

  render () {
    return (<div className="body">
      <CloseChannel partner={null}
                    tokenAddress={null}
                    tokenNetworkAddress={null}
                    tokenName={null}
                    channelIdentifier={null}/>
      <DepositOnChannel destination={'some'}
                        channelIdentifier={null}
                        tokenAddress={null}
                        tokenNetworkAddress={null}
                        tokenName={null}
                        tokenSymbol={'RIF'} />
      <OpenChannel tokenAddress={null}
                   tokenNetworkAddress={null}
                   tokenName={null}
                   tokenSymbol={'RIF'}/>
    </div>);
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
module.exports = connect(mapStateToProps, mapDispatchToProps)(Renew)
