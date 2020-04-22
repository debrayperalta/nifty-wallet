const actions = require('../actions');

const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_DOMAIN_REGISTER_PAGE: 'SHOW_DOMAIN_REGISTER_PAGE',
  SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE: 'SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  showDomainsPage,
  showDomainsDetailPage,
  showDomainRegisterPage,
  showPaymentsPage,
  showModal,
  hideModal,
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  getDomainDetails,
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

function showDomainRegisterPage (domainName) {
  return {
    type: rifActions.SHOW_DOMAIN_REGISTER_PAGE,
    value: {
      domainName: domainName,
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

function getDomainDetails (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
        background.rif.rns.resolver.getDomainDetails(domainName, (error, details) => {
          console.log("This are the details bringed", details)
          if (error) {
            dispatch(actions.displayWarning(error));
            return reject(error);
          }
          dispatch(actions.hideLoadingIndication());
          return resolve(details);
        })      
    })
  }
}

module.exports = rifActions
