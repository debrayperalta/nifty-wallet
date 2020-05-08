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
    gasCost: PropTypes.number,
    commitment: PropTypes.string,
    getUnapprovedTransactions: PropTypes.func,
    showTransactionConfirmPage: PropTypes.func,
    registeringProgress: PropTypes.number,
    completeRegistration: PropTypes.func,
    canCompleteRegistration: PropTypes.func,
    viewDomainDetails: PropTypes.func,
    selectedAddress: PropTypes.string,
    getSelectedAddress: PropTypes.func,
    waitForListener: PropTypes.func,
  }

  async componentDidMount () {
    if (!this.props.selectedAddress) {
      const address = await this.props.getSelectedAddress();
      this.props.showThis({
        ...this.props,
        selectedAddress: address,
      })
    }
  }

  // TODO: change this to use obs store
  storePendingDomain () {
    let domains = JSON.parse(localStorage.getItem('rnsDomains'));
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + this.props.yearsToRegister);
    const pendingDomain = {
      domain: this.props.domainName,
      expiration: expirationDate.toDateString(),
      autoRenew: false,
      status: 'pending',
      address: this.props.selectedAddress,
      content: '',
      ownerAddress: this.props.selectedAddress,
      isLuminoNode: true,
      isRifStorage: true,
      resolvers: [],
    };
    if (!domains) {
      domains = [];
    }
    if (domains.filter(domain => domain.domain === this.props.domainName).length <= 0) {
      domains.push(pendingDomain);
    }
    localStorage.setItem('rnsDomains', JSON.stringify(domains));
  }

  // TODO: change this to use obs store, this is not safe, the user can go to another page and we will have errors
  changeDomainStatusAndStore () {
    const domains = JSON.parse(localStorage.getItem('rnsDomains'));
    const domain = domains.filter(domain => domain.domain === this.props.domainName)[0];
    domain.status = 'active';
    localStorage.setItem('rnsDomains', JSON.stringify(domains));
  }

  showRegistration () {
    this.props.getCost(this.props.domainName, 1)
      .then(costInWei => {
        const costInRif = costInWei / 1e18;
        this.props.showThis({
          ...this.props,
          currentStep: 'register',
          yearsToRegister: 1,
          costInRif: costInRif,
          gasCost: 0,
        });
      });
  }

  async initiateRegistration () {
    const result = await this.props.requestRegistration(this.props.domainName, this.props.yearsToRegister);
    this.props.waitForListener(result.transactionListenerId)
      .then(transactionReceipt => {
        this.afterCommitConfirmation(result.commitment);
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

  afterRegistration () {
    this.changeDomainStatusAndStore();
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

  afterCommitConfirmation (commitment, progress = 0) {
    this.storePendingDomain();
    this.props.showThis({
      ...this.props,
      currentStep: 'registering',
      commitment: commitment,
      registeringProgress: progress,
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
        currentStep: 'register',
        yearsToRegister: yearsToRegister,
        costInRif: costInRif,
        gasCost: 0,
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
      register: (
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
          <div>
            <span>Gas Cost:</span><span>{this.props.gasCost}</span><span>RBTC</span>
          </div>
        </div>
      ),
      registering: (
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
            <progress max="120" value={this.props.registeringProgress}/>
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
    if (currentStep === 'registering' && this.props.registeringProgress <= 120) {
      const timeout = setTimeout(() => {
        this.afterCommitConfirmation(this.props.commitment, this.props.registeringProgress + 4);
        clearTimeout(timeout);
      }, registrationTimeouts.registering * 1000);
    } else if (currentStep === 'registering' && this.props.registeringProgress >= 120) {
      this.props.canCompleteRegistration(this.props.commitment)
        .then(canFinish => {
          if (canFinish) {
            this.props.showThis({
              ...this.props,
              currentStep: 'readyToRegister',
            });
          } else {
            this.props.showThis({
              ...this.props,
            });
          }
        });
    } else if (currentStep === 'registerConfirmation') {
      // we wait a little until we show the done page to give time to get the confirmation.
      const timeout = setTimeout(() => {
        this.afterRegistration();
        clearTimeout(timeout);
      }, registrationTimeouts.registerConfirmation * 1000);
    }
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
    getSelectedAddress: () => dispatch(rifActions.getSelectedAddress()),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
