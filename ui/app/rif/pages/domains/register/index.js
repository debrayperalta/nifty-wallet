import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import rifActions from '../../../actions';
import niftyActions from '../../../../actions';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {SearchDomains} from '../../../components';

class DomainRegisterScreen extends Component {

  static propTypes = {
    domainName: PropTypes.string,
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
    currentStep: PropTypes.string,
    yearsToRegister: PropTypes.number,
    costInRif: PropTypes.number,
    gasCost: PropTypes.number,
    commitment: PropTypes.string,
  }

  showRegistration () {
    this.props.dispatch(rifActions.getRegistrationCost(this.props.domainName, 1))
      .then(costInWei => {
        const costInRif = costInWei / 1e18;
        this.props.dispatch(rifActions.showRegisterNewDomain({
          domainName: this.props.domainName,
          currentStep: 'register',
          yearsToRegister: 1,
          costInRif: costInRif,
          gasCost: 0,
        }));
      });
  }

  async initiateRegistration () {
    const commitment = await this.props.dispatch(rifActions.requestDomainRegistration(this.props.domainName, this.props.yearsToRegister))
    await this.props.dispatch(rifActions.waitUntil());
    this.showConfirmTransactionPage((commitment) => this.afterCommitSubmission(commitment), commitment);
  }

  showConfirmTransactionPage (callback, payload) {
    this.props.dispatch(rifActions.getUnapprovedTransactions())
      .then(latestTransaction => {
        this.props.dispatch(niftyActions.showConfTxPage({
          id: latestTransaction.id,
          unapprovedTransactions: latestTransaction,
          afterApproval: {
            action: (payload) => callback(payload),
            payload: payload,
          },
        }));
      });
  }

  afterCommitSubmission (commitment) {
    this.props.dispatch(rifActions.showRegisterNewDomain({
      domainName: this.props.domainName,
      currentStep: 'registering',
      yearsToRegister: this.props.yearsToRegister,
      costInRif: this.props.costInRif,
      gasCost: 0,
      commitment: commitment,
    }));
  }

  changeYearsToRegister (yearsToRegister) {
    if (yearsToRegister && yearsToRegister > 0) {
      this.props.dispatch(rifActions.getRegistrationCost(this.props.domainName, yearsToRegister))
        .then(costInWei => {
          const costInRif = costInWei / 1e18;
          this.props.dispatch(rifActions.showRegisterNewDomain({
            domainName: this.props.domainName,
            currentStep: 'register',
            yearsToRegister: yearsToRegister,
            costInRif: costInRif,
            gasCost: 0,
          }));
        });
    }
  }

  getBody (currentStep) {
    const style = { width: 96, height: 96 };
    const partials = {
      available: (
        <div className="domainRegisterAnimation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <div>
            Domain Available
          </div>
        </div>
      ),
      register: (
        <div className="domainRegisterInitiate">
          <div>
            You are going to renew {this.props.domainName}
          </div>
          <div>
            <span>Number of years:</span>
            <span onClick={() => this.changeYearsToRegister(this.props.yearsToRegister - 1)}>
              <i className="fa fa-minus"/>
            </span>
            <span>{this.props.yearsToRegister}</span>
            <span onClick={() => this.changeYearsToRegister(this.props.yearsToRegister + 1)}>
              <i className="fa fa-plus"/>
            </span>
          </div>
          <div>
            <span>Cost in RIF:</span><span>{this.props.costInRif}</span><span>RIF</span>
          </div>
          <div>
            <span>Gas Cost:</span><span>{this.props.gasCost}</span><span>RBTC</span>
          </div>
        </div>
      ),
      registering: (
        <div className="domainRegisterAnimation">
          <div>
            You need to wait 1 minute. Then you can confirm the registration.
            You commitment is: {this.props.commitment}
          </div>
        </div>
      ),
    };
    return partials[currentStep];
  }

  getButtons (currentStep) {
    const partials = {
      available: (
        <div className="button-container">
          <button onClick={() => this.showRegistration()}>Register Domain</button>
        </div>
      ),
      register: (
        <div className="button-container">
          <button onClick={() => this.initiateRegistration()}>Initiate Registration</button>
        </div>
      ),
    };
    return partials[currentStep];
  }

  render () {
    const registerBody = this.getBody(this.props.currentStep ? this.props.currentStep : 'available');
    const registerButtons = this.getButtons(this.props.currentStep ? this.props.currentStep : 'available');
    console.log('REGISTER BODY', registerBody);
    return (
      <div className={'body'}>
        <FontAwesomeIcon icon={faChevronLeft} className={'rif-back-button'} onClick={() => this.props.goBack()}/>
        <SearchDomains />
        <div id="headerName" className={'domain-name'}>
          <div>{this.props.domainName}</div>
        </div>
        {registerBody}
        {registerButtons}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    domainName: state.appState.currentView.data.domainName,
    currentStep: state.appState.currentView.data.currentStep,
    yearsToRegister: state.appState.currentView.data.yearsToRegister,
    costInRif: state.appState.currentView.data.costInRif,
    gasCost: state.appState.currentView.data.gasCost,
    commitment: state.appState.currentView.data.commitment,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goBack: () => dispatch(rifActions.showDomainsPage()),
    dispatch: dispatch,
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
