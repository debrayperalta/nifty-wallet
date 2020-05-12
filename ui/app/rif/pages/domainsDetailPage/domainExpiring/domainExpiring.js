import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

class DomainExpiring extends Component {
  static propTypes = {
    domainName: PropTypes.string.isRequired,
  }

  render () {
    const { domainName } = this.props
    return (
      <div>
        <DomainHeader domainName={domainName}>
          <div className={'domain-expiring-mark'}>EXPIRING</div>
        </DomainHeader>
        <div className="domain-expiring">
          <FontAwesomeIcon icon={faExclamationTriangle} color={'#D5E300'} className={'domain-expiring-icon'}/>
          <div>
            Your domain is expiring
          </div>
          <div className="button-container">
            <button onClick={() => {}}>Renew now!</button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const data = state.appState.currentView.params;
  return {
    dispatch: state.dispatch,
    domainName: data.domain,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewNetwork: (message) => dispatch(rifActions.showModal(message)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainExpiring)
