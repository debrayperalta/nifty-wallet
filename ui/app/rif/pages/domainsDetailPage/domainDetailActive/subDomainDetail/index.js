import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class SubDomainDetail extends Component {

  static propTypes = {
    domainName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }

  render = () => {
    const {domainName, name} = this.props;
    return <div><h3>{name}.{domainName}</h3></div>
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

export default connect(mapStateToProps, null)(SubDomainDetail);
