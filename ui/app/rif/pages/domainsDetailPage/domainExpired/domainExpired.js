import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons'

class DomainExpired extends Component {
	static propTypes = {
    domainName: PropTypes.string.isRequired,
	}

	render () {
    const { domainName } = this.props
		return (
		<div>
      <DomainHeader domainName={domainName}>
        <div className={'domain-expired-mark'}>EXPIRED</div>
      </DomainHeader>
      <div className="domain-expired">
        <FontAwesomeIcon icon={faBan} color={'#E60000'} className={'domain-expired-icon'}/>
        <div>
          Your domain is expired
        </div>
        <div className="button-container">
          <button onClick={() => {}}>Register Now!</button>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainExpired)
