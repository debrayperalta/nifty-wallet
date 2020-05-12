import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import rifActions from '../../../actions'
import niftyActions from '../../../../actions'
import {registrationTimeouts} from '../../../constants'
import {pageNames} from '../../index'

class DomainRegisterScreen extends Component {

  static propTypes = {
    domainName: PropTypes.string,
    requestRegistration: PropTypes.func,
    getCost: PropTypes.func,
    showThis: PropTypes.func,
    dispatch: PropTypes.func,
    currentStep: PropTypes.string,
    yearsToRegister: PropTypes.number,
    costInRif: PropTypes.number,
    commitment: PropTypes.string,
    getUnapprovedTransactions: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
    completeRegistration: PropTypes.func,
    canCompleteRegistration: PropTypes.func,
    viewDomainDetails: PropTypes.func,
    waitForListener: PropTypes.func,
    getDomain: PropTypes.func,
    updateDomains: PropTypes.func,
    domain: PropTypes.object,
    isDomainAvailable: PropTypes.func,
    showToast: PropTypes.func,
    showDomainList: PropTypes.func,
    navBar: PropTypes.object,
    showLoading: PropTypes.func,
  }

  initialize () {
    const {domain, currentStep} = this.props;
    if (domain && !currentStep) {
      if (domain.registration) {
        if (domain.registration.readyToRegister) {
          // domain not available, that means is pending or is already registered.
          this.showReadyToRegister();
        } else {
          // domain not available, that means is pending or is already registered.
          this.showWaitingForRegister();
        }
      } else {
        this.props.showToast('Domain already registered!', false);
        this.props.showDomainList();
      }
    } else if (!currentStep) {
      // otherwise is available and ready for register
      const available = this.props.isDomainAvailable(this.props.domainName);
      if (!available) {
        // is not available for registration so we redirect to domain list with a warning
        this.props.showToast('Domain not available, can not be registered!', false);
        this.props.showDomainList();
      }
    }
  }

  showWaitingForRegister () {
    this.props.showThis({
      ...this.props,
      currentStep: 'waitingForRegister',
      navBar: {
        showBack: false,
        title: this.props.navBar.title,
      },
    });
  }

  componentDidMount () {
    this.props.showLoading();
    this.initialize();
    this.props.showLoading(false);
  }

  async getUpdatedDomain () {
    return await this.props.getDomain(this.props.domainName);
  }

  async changeDomainStatus (status) {
    const domain = await this.getUpdatedDomain();
    domain.status = status;
    await this.props.updateDomains(domain);
  }

  showRegistration () {
    this.props.getCost(this.props.domainName, 1)
      .then(costInWei => {
        const costInRif = costInWei / 1e18;
        this.props.showThis({
          ...this.props,
          currentStep: 'setupRegister',
          yearsToRegister: 1,
          costInRif: costInRif,
        });
      });
  }

  async initiateRegistration () {
    const result = await this.props.requestRegistration(this.props.domainName, this.props.yearsToRegister);
    this.props.waitForListener(result.transactionListenerId)
      .then(transactionReceipt => {
        this.showWaitingForRegister();
      });
    this.props.showTransactionConfirmPage({
      action: () => this.showWaitingForConfirmation(),
    });
  }

  async completeRegistration () {
    const transactionListenerId = await this.props.completeRegistration(this.props.domainName);
    this.props.waitForListener(transactionListenerId)
      .then(transactionReceipt => {
        this.afterRegistration();
      });
    this.props.showTransactionConfirmPage({
      action: () => this.afterRegistrationSubmit(),
    });
  }

  viewDomainDetails () {
    this.props.viewDomainDetails(this.props.domainName);
  }

  async afterRegistration () {
    await this.changeDomainStatus('active');
    this.props.showThis({
      ...this.props,
      currentStep: 'registered',
    });
  }

  afterRegistrationSubmit () {
    this.props.showThis({
      ...this.props,
      currentStep: 'waitingForConfirmation',
    });
  }

  showWaitingForConfirmation () {
    this.props.showThis({
      ...this.props,
      currentStep: 'waitingForConfirmation',
    });
  }

  async changeYearsToRegister (yearsToRegister) {
    if (yearsToRegister && yearsToRegister > 0) {
      const costInWei = await this.props.getCost(this.props.domainName, yearsToRegister);
      const costInRif = costInWei / 1e18;
      this.props.showThis({
        ...this.props,
        currentStep: 'setupRegister',
        yearsToRegister: yearsToRegister,
        costInRif: costInRif,
      });
    }
  }

  getBody (currentStep) {
    const partials = {
      available: (
        <div className="domainRegisterAnimation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <div>
            Domain Available
          </div>
        </div>
      ),
      setupRegister: (
        <div className="domainRegisterInitiate">
          <div>
            You are going to register <span className="bold">{this.props.domainName}</span>
          </div>
          <div>
            <span>Number of years:</span>
            <span className="hand-over" onClick={() => this.changeYearsToRegister(this.props.yearsToRegister - 1)}>
              <i className="fa fa-minus"/>
            </span>
            <span>{this.props.yearsToRegister}</span>
            <span className="hand-over" onClick={() => this.changeYearsToRegister(this.props.yearsToRegister + 1)}>
              <i className="fa fa-plus"/>
            </span>
          </div>
          <div>
            <span>Cost in RIF:</span><span>{this.props.costInRif}</span><span>RIF</span>
          </div>
        </div>
      ),
      waitingForRegister: (
        <div className="domainRegisterProgress">
          <div>
            <article className="clock">
              <div className="minutes-container">
                <div className="minutes"/>
              </div>
              <div className="seconds-container">
                <div className="seconds"/>
              </div>
            </article>
            <p>
              Waiting for confirmation. You need to wait while we secure your domain, then you need to confirm the registration at the final step
            </p>
          </div>
        </div>
      ),
      readyToRegister: (
        <div className="domainRegisterProgress domainRegisterAnimation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <div>
            We are ready!
          </div>
        </div>
      ),
      waitingForConfirmation: (
        <div className="domainRegisterAnimation">
          <div>Waiting for confirmation...</div>
        </div>
      ),
      registered: (
        <div className="domainRegisterAnimation">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          <div>
            <div>Congratulations</div>
            <div>The domain is yours</div>
          </div>
        </div>
      ),
    };
    if (currentStep === 'waitingForRegister') {
      const timeout = setTimeout(() => {
        this.getUpdatedDomain().then(domain => {
          if (domain.registration && domain.registration.readyToRegister) {
            this.showReadyToRegister();
          } else {
            this.showWaitingForRegister();
          }
          clearTimeout(timeout);
        });
      }, registrationTimeouts.secondsToCheckForCommitment * 1000);
    }
    return partials[currentStep];
  }

  showReadyToRegister () {
    this.props.showThis({
      ...this.props,
      currentStep: 'readyToRegister',
      navBar: {
        showBack: false,
        title: this.props.navBar.title,
      },
    });
  }

  getButtons (currentStep) {
    const partials = {
      available: (
        <div className="button-container">
          <button onClick={() => this.showRegistration()}>Register Domain</button>
        </div>
      ),
      setupRegister: (
        <div className="button-container">
          <button onClick={() => this.initiateRegistration()}>Initiate Registration</button>
        </div>
      ),
      readyToRegister: (
        <div className="button-container">
          <button onClick={() => this.completeRegistration()}>Register</button>
        </div>
      ),
      registered: (
        <div className="button-container">
          <button onClick={() => this.viewDomainDetails()}>View Domain Details</button>
        </div>
      ),
    };
    return partials[currentStep];
  }

  render () {
    const registerBody = this.getBody(this.props.currentStep ? this.props.currentStep : 'available');
    const registerButtons = this.getButtons(this.props.currentStep ? this.props.currentStep : 'available');
    return (
      <div className={'body'}>
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
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch: dispatch,
    showThis: (data) => dispatch(rifActions.navigateTo(pageNames.rns.domainRegister, {
      navBar: {
        title: 'Domain Register',
      },
      ...data,
    })),
    getCost: (domainName, yearsToRegister) => dispatch(rifActions.getRegistrationCost(domainName, yearsToRegister)),
    requestRegistration: (domainName, yearsToRegister) => dispatch(rifActions.requestDomainRegistration(domainName, yearsToRegister)),
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    completeRegistration: (domainName) => dispatch(rifActions.finishRegistration(domainName)),
    canCompleteRegistration: (commitment) => dispatch(rifActions.canFinishRegistration(commitment)),
    viewDomainDetails: (domainName) => dispatch(rifActions.navigateTo(pageNames.rns.domainsDetail, domainName)),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
    getDomain: (domainName) => dispatch(rifActions.getDomain(domainName)),
    updateDomains: (domain) => dispatch(rifActions.updateDomains(domain)),
    showToast: (text, success) => dispatch(niftyActions.displayToast(text, success)),
    isDomainAvailable: (domainName) => dispatch(rifActions.checkDomainAvailable(domainName)),
    showDomainList: () => dispatch(rifActions.navigateTo(pageNames.rns.domains)),
    showLoading: (loading = true, message) => loading ? dispatch(niftyActions.showLoadingIndication(message)) : dispatch(niftyActions.hideLoadingIndication()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
