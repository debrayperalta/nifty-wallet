import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import rifActions from '../../../actions';
import DomainHeader from '../../../components/domain-header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import {Menu} from '../../../components';
import {pageNames} from '../../index';

class DomainExpiring extends Component {
  static propTypes = {
    domainName: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    expirationDate: PropTypes.string.isRequired,
    autoRenew: PropTypes.bool.isRequired,
    ownerAddress: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    isLuminoNode: PropTypes.bool,
    isRifStorage: PropTypes.bool,
    navigateTo: PropTypes.func,
  }

  render () {
    const { domainName, content, expirationDate, autoRenew, ownerAddress, isOwner, isLuminoNode, isRifStorage } = this.props;
    const domainInfo = {
      domainName,
      expirationDate,
      autoRenew,
      ownerAddress,
      isOwner,
      isLuminoNode,
      isRifStorage,
      content,
    };
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
            <button onClick={() => this.props.navigateTo(pageNames.rns.renew, 'Renew Domain')}>Renew now!</button>
          </div>
        </div>
        <Menu domainInfo={domainInfo} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  const data = state.appState.currentView.params;
  return {
    dispatch: state.dispatch,
    domainName: data.domain,
    content: data.content,
    expirationDate: data.expiration,
    autoRenew: data.autoRenew,
    ownerAddress: data.ownerAddress,
    isOwner: state.metamask.selectedAddress.toLowerCase() === data.ownerAddress.toLowerCase(),
    isLuminoNode: data.isLuminoNode,
    isRifStorage: data.isRifStorage,
    resolvers: data.resolvers,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addNewNetwork: (message) => dispatch(rifActions.showModal(message)),
    navigateTo: (screenName, title, params) => {
      dispatch(rifActions.navigateTo(screenName, {
        ...params,
        tabOptions: {
          screenTitle: title,
        },
      }));
    },
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainExpiring)
