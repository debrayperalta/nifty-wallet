const actions = require('../actions');

const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE: 'SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showModal,
  hideModal,
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  registerDomain,
  finishRegistration,
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
    })
  }
}

function registerDomain (domainName, yearsToRegister) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.requestRegistration(domainName, yearsToRegister, (error, secret) => {
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        dispatch(actions.hideLoadingIndication());
        return resolve(secret);
      });
    })
  }
}

function finishRegistration (domainName, yearsToRegister, secret) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.finishRegistration(domainName, yearsToRegister, secret);
      resolve();
    })
  }
}

module.exports = rifActions
