const actions = require('../actions');

const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE: 'SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  SHOW_DOMAINS_REGISTER: 'SHOW_DOMAINS_REGISTER',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showModal,
  hideModal,
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  requestDomainRegistration,
  canFinishRegistration,
  finishRegistration,
  showRegisterNewDomain,
  getRegistrationCost,
  getUnapprovedTransactions,
  waitUntil,
}

let background = null;

function setBackgroundConnection (backgroundConnection) {
  background = backgroundConnection;
}

function showDomainsPage () {
  return {
    type: rifActions.SHOW_DOMAINS_PAGE,
  }
}

function showDomainsDetailPage (data) {
  return {
    type: rifActions.SHOW_DOMAINS_DETAIL_PAGE,
    value: {
      value: data,
    },
  }
}

function showPaymentsPage () {
  return {
    type: rifActions.SHOW_PAYMENTS_PAGE,
  }
}

function showModal (message) {
  return {
    type: rifActions.SHOW_MODAL,
    message: message,
  }
}

function hideModal () {
  return {
    type: rifActions.HIDE_MODAL,
  }
}

function checkDomainAvailable (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.isDomainAvailable(domainName, (error, available) => {
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        dispatch(actions.hideLoadingIndication());
        return resolve(available);
      });
    });
  };
}

function requestDomainRegistration (domainName, yearsToRegister) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.requestRegistration(domainName, yearsToRegister, (error, commitment) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(commitment);
      });
    });
  };
}

function canFinishRegistration (commitmentHash) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.canFinishRegistration(commitmentHash, (error, result) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function finishRegistration (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.finishRegistration(domainName);
      return resolve();
    });
  };
}

function getRegistrationCost (domainName, yearsToRegister) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.getDomainCost(domainName, yearsToRegister, (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function showRegisterNewDomain (data) {
  return {
    type: rifActions.SHOW_DOMAINS_REGISTER,
    data: data,
  }
}

function getUnapprovedTransactions () {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.getUnapprovedTransactions((error, transactions) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          return reject(error);
        }
        return resolve(transactions);
      });
    });
  };
}

/**
 * This is used only for specific cases where we can't do anything else to sync with the plugin state machine
 * rather than wait. We wait until the state machine get's the latest transactions.
 * @param time to wait in milliseconds
 * @returns a Promise that's resolved when the time is done.
 */
function waitUntil (time = 1000) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        dispatch(actions.hideLoadingIndication());
        clearTimeout(timeout);
        return resolve();
      }, time);
    });
  }
}

module.exports = rifActions
