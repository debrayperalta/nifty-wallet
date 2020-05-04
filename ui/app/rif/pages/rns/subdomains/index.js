import React, {Component} from 'react'
import {connect} from 'react-redux'
import DomainHeader from '../../../components/domain-header'
import PropTypes from 'prop-types'

class Subdomains extends Component {

  static propTypes = {
    domainInfo: PropTypes.object,
  }

  render () {
    const {domainName, isOwner, isLuminoNode, isRifStorage} = this.props.domainInfo;
    return (
      <div className="body">
        <DomainHeader domainName={domainName}
                      showOwnerIcon={isOwner}
                      showLuminoNodeIcon={isLuminoNode}
                      showRifStorageIcon={isRifStorage}/>
      </div>
    );
  }
}
function mapStateToProps (state) {
  // params is the params value or object passet to rifActions.navigateTo('pageName', params)
  const params = state.appState.currentView.params;
  return {
    domainInfo: params.domainInfo,
  }
}

function mapDispatchToProps (dispatch) {
  return {}
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Subdomains)
