const actions = require('../actions');

const rifActions = {
  SHOW_MODAL: 'SHOW_MODAL',
  SHOW_MENU: 'SHOW_MENU',
  NAVIGATE_TO: 'NAVIGATE_TO',
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  getDomainDetails,
  setResolverAddress,
  requestDomainRegistration,
  canFinishRegistration,
  finishRegistration,
  getRegistrationCost,
  getUnapprovedTransactions,
  waitUntil,
  getSelectedAddress,
  showMenu,
  hideMenu,
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
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(available);
      });
    });
  };
}

function getDomainDetails (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
        background.rif.rns.resolver.getDomainDetails(domainName, (error, details) => {
          console.debug('This are the details bringed', details);
          dispatch(actions.hideLoadingIndication());
          if (error) {
            dispatch(actions.displayWarning(error));
            return reject(error);
          }
          return resolve(details);
        });
    })
  }
}

function setResolverAddress (domainName, resolverAddress) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.setResolver(domainName, resolverAddress, (error, result) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    })
  }
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

function showDomainRegisterPage (data) {
  if (data && !data.domainName) {
    data = {
      domainName: data,
      currentStep: 'available',
    }
  }
  return {
    type: rifActions.SHOW_DOMAIN_REGISTER_PAGE,
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

function getSelectedAddress () {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.getSelectedAddress((error, selectedAddress) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          return reject(error);
        }
        return resolve(selectedAddress);
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

function hideMenu () {
  return {
    type: rifActions.SHOW_MENU,
    data: null,
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
