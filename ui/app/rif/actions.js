const actions = require('../actions');

const rifActions = {
  SHOW_MODAL: 'SHOW_MODAL',
  SHOW_MENU: 'SHOW_MENU',
  NAVIGATE_TO: 'NAVIGATE_TO',
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  registerDomain,
  canFinishRegistration,
  finishRegistration,
  showMenu,
  navigateTo,
  showModal,
  hideModal,
}

let background = null;

function setBackgroundConnection (backgroundConnection) {
  background = backgroundConnection;
}

function hideModal () {
  return {
    type: rifActions.SHOW_MODAL,
    currentModal: null,
  }
}

function showModal (message, modalName = 'generic-modal') {
  return {
    type: rifActions.SHOW_MODAL,
    currentModal: {
      name: modalName,
      message,
    },
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
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(secret);
      });
    })
  }
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
    })
  }
}

function finishRegistration (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.finishRegistration(domainName);
      return resolve();
    })
  }
}

function showMenu (data) {
  return {
    type: rifActions.SHOW_MENU,
    data: data,
  }
}

function navigateTo (screenName, params) {
  return {
    type: rifActions.NAVIGATE_TO,
    data: {
      screenName,
      params,
    },
  }
}

module.exports = rifActions
