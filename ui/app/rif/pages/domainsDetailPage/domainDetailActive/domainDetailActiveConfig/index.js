import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GET_RESOLVERS } from '../../../../constants';

// TODO @fmelo
// Here you can set the classnames for the entire page
const styles = {

}

class DomainsDetailConfigurationScreen extends Component {
  static propTypes = {
    domain: PropTypes.object.isRequired,
    domainName: PropTypes.string.isRequired,
  }
  constructor (props) {
    super(props);
    const resolvers = Object.assign([], GET_RESOLVERS());
    this.state = {
      resolvers: resolvers,
    };
  }

  render () {
    return (
      <div className={''}>
        Config page
      </div>
    );
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  const domain = params.domain;
  const details = domain.details || params.details;
  return {
    dispatch: state.dispatch,
    status: details.status,
    domainName: details.name,
    domain: domain,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainsDetailConfigurationScreen)
