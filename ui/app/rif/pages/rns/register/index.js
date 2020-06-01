import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import rifActions from '../../../actions';
import niftyActions from '../../../../actions';
import {registrationTimeouts} from '../../../constants';
import {pageNames} from '../../index';
import extend from 'xtend';

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
    tabOptions: PropTypes.object,
    showLoading: PropTypes.func,
  }

  componentDidMount () {
    this.props.showLoading();
    this.initialize().then(() => {
      this.props.showLoading(false);
    });
  }

  async initialize () {
    const {domain, domainName, currentStep} = this.props;
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
      const available = this.props.isDomainAvailable(domainName);
      if (!available) {
        // is not available for registration so we redirect to domain list with a warning
        this.props.showToast('Domain not available, can not be registered!', false);
        this.props.showDomainList();
      } else {
        await this.calculateAndFillCost(domainName, 1);
      }
    }
  }

  async calculateAndFillCost (domainName, yearsToRegister) {
    const costInWei = await this.props.getCost(domainName, yearsToRegister);
    const costInRif = costInWei / 1e18;
    this.props.showThis(extend(this.props, {
      yearsToRegister,
      costInRif,
    }));
  }

  async getUpdatedDomain () {
    return await this.props.getDomain(this.props.domainName);
  }

  async changeDomainStatus (status) {
    const domain = await this.getUpdatedDomain();
    domain.status = status;
    await this.props.updateDomains(domain);
  }

  showWaitingForRegister () {
    this.props.showThis(extend(this.props, {
      currentStep: 'waitingForRegister',
      tabOptions: {
        showBack: false,
        hideTitle: true,
      },
    }));
  }

  showWaitingForConfirmation () {
    this.props.showThis({
      ...this.props,
      currentStep: 'waitingForConfirmation',
      tabOptions: {
        showBack: false,
        hideTitle: true,
      },
    });
  }

  showReadyToRegister () {
    this.props.showThis({
      ...this.props,
      currentStep: 'readyToRegister',
      tabOptions: {
        showBack: false,
        hideTitle: true,
      },
    });
  }

  async requestDomain () {
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
    this.props.getDomain(this.props.domainName)
      .then(domain => {
        this.props.viewDomainDetails({
          domain: domain,
          status: domain.details.status,
          tabOptions: {
            screenTitle: 'Domain Detail',
            showBack: false,
          },
        });
      })
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

  getTitle (currentStep) {
    if (currentStep !== 'registered') {
      return (<div>Buying {this.props.domainName}</div>);
    }
    return null;
  }

  getBody (currentStep) {
    const partials = {
      setupRegister: (
        <div className="domainRegisterInitiate">
          <div>
            <span>Number of years:</span>
            <span className="hand-over" onClick={() => this.changeYearsToRegister(this.props.yearsToRegister - 1)}>
              <i className="fa fa-minus"/>
            </span>
            <span>{this.props.yearsToRegister}</span>
            <span className="hand-over" onClick={() => this.changeYearsToRegister(this.props.yearsToRegister + 1)}>
              <i className="fa fa-plus"/>
            </span>
            <span>
              50% discount per year <span>from the third year</span>
            </span>
          </div>
          <div>
            <span>Cost</span><span>{this.props.costInRif}</span><span>RIF</span>
          </div>
          <div>
            You will be asked to confirm the first of two transactions required (request & register)
            to buy your domain.
          </div>
        </div>
      ),
      waitingForRegister: (
        <div>
          <div>
            <div>Confirming transaction</div>
            <div className="app-loader">Loading...</div>
            <p>Wait until the domain is requested then click Register to buy the domain.</p>
          </div>
        </div>
      ),
      readyToRegister: (
        <div>
          <div>Your domain has been requested</div>
          <div>Click Register to buy the domain.</div>
        </div>
      ),
      waitingForConfirmation: (
        <div>
          <div>Confirming transaction</div>
          <div>Loading...</div>
        </div>
      ),
      registered: (
        <div>
          <div>
            <div>Congrats!</div>
            <div>{this.props.domainName} is yours</div>
            <div>Check it in the explorer</div>
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

  getButtons (currentStep) {
    const partials = {
      setupRegister: (
        <div className="button-container">
          <button onClick={() => this.requestDomain()}>Request Domain</button>
        </div>
      ),
      waitingForRegister: (
        <div className="button-container">
          <button disabled={true}>Register</button>
        </div>
      ),
      readyToRegister: (
        <div className="button-container">
          <button onClick={() => this.completeRegistration()}>Register</button>
        </div>
      ),
      registered: (
        <div className="button-container">
          <button onClick={() => this.props.showDomainList()}>My Domains</button>
          <button onClick={() => this.viewDomainDetails()}>List in Marketplace</button>
        </div>
      ),
    };
    return partials[currentStep];
  }

  render () {
    const currentStep = this.props.currentStep ? this.props.currentStep : 'setupRegister';
    const title = this.getTitle(currentStep);
    const body = this.getBody(currentStep);
    const buttons = this.getButtons(currentStep);
    return (
      <div className="body">
        {title}
        {body}
        {buttons}
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
      tabOptions: {
        screenTitle: 'Domain Register',
      },
      ...data,
    })),
    getCost: (domainName, yearsToRegister) => dispatch(rifActions.getRegistrationCost(domainName, yearsToRegister)),
    requestRegistration: (domainName, yearsToRegister) => dispatch(rifActions.requestDomainRegistration(domainName, yearsToRegister)),
    getUnapprovedTransactions: () => dispatch(rifActions.getUnapprovedTransactions()),
    showTransactionConfirmPage: (afterApproval) => dispatch(rifActions.goToConfirmPageForLastTransaction(afterApproval)),
    completeRegistration: (domainName) => dispatch(rifActions.finishRegistration(domainName)),
    canCompleteRegistration: (commitment) => dispatch(rifActions.canFinishRegistration(commitment)),
    viewDomainDetails: (params) => dispatch(rifActions.navigateTo(pageNames.rns.domainsDetail, {
      tabOptions: {
        screenTitle: 'Domain Details',
      },
      ...params,
    })),
    waitForListener: (transactionListenerId) => dispatch(rifActions.waitForTransactionListener(transactionListenerId)),
    getDomain: (domainName) => dispatch(rifActions.getDomain(domainName)),
    updateDomains: (domain) => dispatch(rifActions.updateDomains(domain)),
    showToast: (text, success) => dispatch(niftyActions.displayToast(text, success)),
    isDomainAvailable: (domainName) => dispatch(rifActions.checkDomainAvailable(domainName)),
    showDomainList: () => dispatch(rifActions.navigateTo(pageNames.rns.domains, {
      tabOptions: {
        showBack: false,
      },
    })),
    showLoading: (loading = true, message) => loading ? dispatch(niftyActions.showLoadingIndication(message)) : dispatch(niftyActions.hideLoadingIndication()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(DomainRegisterScreen)
