import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import rifActions from '../../../../actions'
import niftyActions from '../../../../../actions'
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {SearchDomains} from '../../../../components'
import {registrationTimeouts} from '../../../../constants';

class DomainRegisterScreen extends Component {

  static propTypes = {
    domainName: PropTypes.string,
    wait: PropTypes.func,
    requestRegistration: PropTypes.func,
    getCost: PropTypes.func,
    showThis: PropTypes.func,
    dispatch: PropTypes.func,
    goBack: PropTypes.func,
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
    waitingForConfirmation: PropTypes.bool,
    viewDomainDetails: PropTypes.func,
    selectedAddress: PropTypes.string,
    getSelectedAddress: PropTypes.func,
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

  changeDomainStatusAndStore () {
    const domains = JSON.parse(localStorage.getItem('rnsDomains'));
    const domain = domains.filter(domain => domain.domain === this.props.domainName)[0];
    domain.status = 'active';
    localStorage.setItem('rnsDomains', JSON.stringify(domains));
  }
  // TODO: change this to use obs store

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
    const commitment = await this.props.requestRegistration(this.props.domainName, this.props.yearsToRegister);
    await this.props.wait();
    this.showConfirmTransactionPage((commitment) => {
      this.storePendingDomain();
      this.afterCommitSubmission(commitment)
    }, commitment);
  }

  async completeRegistration () {
    await this.props.completeRegistration(this.props.domainName);
    await this.props.wait();
    this.showConfirmTransactionPage(() => this.afterConfirmRegistration());
  }

  viewDomainDetails () {
    this.props.viewDomainDetails(this.props.domainName);
  }

  afterRegistration () {
    this.props.showThis({
      ...this.props,
      currentStep: 'registered',
    });
    this.changeDomainStatusAndStore();
  }

  afterConfirmRegistration () {
    this.props.showThis({
      ...this.props,
      currentStep: 'registerConfirmation',
    });
  }

  showConfirmTransactionPage (callback, payload) {
    this.props.getUnapprovedTransactions()
      .then(latestTransaction => {
        this.props.showTransactionConfirmPage({
          id: latestTransaction.id,
          unapprovedTransactions: latestTransaction,
          afterApproval: {
            action: (payload) => {
              if (callback) {
                if (payload) {
                  callback(payload);
                } else {
                  callback();
                }
              }
            },
            payload: payload,
          },
        });
      });
  }

  afterCommitSubmission (commitment, progress = 0) {
    this.props.showThis({
      ...this.props,
      currentStep: 'registering',
      commitment: commitment,
      registeringProgress: progress,
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
    const waitingForConfirmation = this.props.waitingForConfirmation;
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
            {waitingForConfirmation ? (<progress/>) : (<progress max="120" value={this.props.registeringProgress}/>)}
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
      registerConfirmation: (
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
        this.afterCommitSubmission(this.props.commitment, this.props.registeringProgress + 4);
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
              waitingForConfirmation: true,
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
    registeringProgress: state.appState.currentView.data.registeringProgress,
    waitingForConfirmation: state.appState.currentView.data.waitingForConfirmation,
    selectedAddress: state.appState.currentView.data.selectedAddress,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goBack: () => dispatch(rifActions.showDomainsPage()),
    dispatch: dispatch,
    showThis: (data) => dispatch(rifActions.showDomainRegisterPage(data)),
    getCost: (domainName, yearsToRegister) => dispatch(rifActions.getRegistrationCost(domainName, yearsToRegister)),
    requestRegistration: (domainName, yearsToRegister) => dispatch(rifActions.requestDomainRegistration(domainName, yearsToRegister)),
    wait: (time) => dispatch(rifActions.waitUntil(time)),
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (data) => dispatch(niftyActions.showConfTxPage(data)),
    completeRegistration: (domainName) => dispatch(rifActions.finishRegistration(domainName)),
    canCompleteRegistration: (commitment) => dispatch(rifActions.canFinishRegistration(commitment)),
    viewDomainDetails: (domainName) => dispatch(rifActions.showDomainsDetailPage(domainName)),
    getSelectedAddress: () => dispatch(rifActions.getSelectedAddress()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
