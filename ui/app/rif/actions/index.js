import * as niftyActions from '../../actions';
import extend from 'xtend';
import {lumino} from '../../../../app/scripts/controllers/rif/constants';
import {CallbackHandlers} from './callback-handlers';

const rifActions = {
  SHOW_MODAL: 'SHOW_MODAL',
  SHOW_MENU: 'SHOW_MENU',
  NAVIGATE_TO: 'NAVIGATE_TO',
  setBackgroundConnection,
  // RNS
  checkDomainAvailable,
  getDomainDetails,
  setResolverAddress,
  getChainAddresses,
  setChainAddressForResolver,
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
  navigateBack,
  showModal,
  hideModal,
  getSubdomains,
  createSubdomain,
  isSubdomainAvailable,
  goToConfirmPageForLastTransaction,
  waitForTransactionListener,
  deleteSubdomain,
  getDomains,
  getDomain,
  updateDomains,
  // Lumino
  onboarding,
  openChannel,
  closeChannel,
  getChannels,
  getAvailableCallbacks,
  listenCallback,
  createPayment,
  createDeposit,
  getTokens,
}

let background = null;
const navigationStack = [];
let backNavigated = false;

function setBackgroundConnection (backgroundConnection) {
  background = backgroundConnection;
}

function hideModal () {
  return {
    type: rifActions.SHOW_MODAL,
    currentModal: null,
  }
}

function showModal (opts, modalName = 'generic-modal') {
  const defaultOpts = {
    title: null,
    text: null,
    elements: null,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmButtonClass: null,
    confirmCallback: () => {},
    closeAfterConfirmCallback: true,
    cancelButtonClass: null,
    cancelCallback: () => {},
    closeAfterCancelCallback: true,
    validateConfirm: null,
    hideConfirm: false,
    hideCancel: false,
  };
  opts = extend(defaultOpts, opts);
  return {
    type: rifActions.SHOW_MODAL,
    currentModal: {
      name: modalName,
      message: {
        title: opts.title,
        body: opts.body ? opts.body : {
          elements: opts.elements,
          text: opts.text,
        },
        confirmLabel: opts.confirmLabel,
        confirmCallback: opts.confirmCallback,
        closeAfterConfirmCallback: opts.closeAfterConfirmCallback,
        cancelLabel: opts.cancelLabel,
        cancelCallback: opts.cancelCallback,
        closeAfterCancelCallback: opts.closeAfterCancelCallback,
        validateConfirm: opts.validateConfirm,
        hideConfirm: opts.hideConfirm,
        hideCancel: opts.hideCancel,
        confirmButtonClass: opts.confirmButtonClass,
        cancelButtonClass: opts.cancelButtonClass,
      },
    },
  }
}

function checkDomainAvailable (domainName) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.isDomainAvailable(domainName, (error, available) => {
        console.debug('IM HERE', error);
        console.debug('IM HERE TRUE', available);
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(available);
      });
    });
  };
}

function getDomainDetails (domainName) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication());
    return new Promise((resolve, reject) => {
        background.rif.rns.resolver.getDomainDetails(domainName, (error, details) => {
          console.debug('This are the details bringed', details);
          dispatch(niftyActions.hideLoadingIndication());
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve(details);
        });
    })
  }
}

function setResolverAddress (domainName, resolverAddress) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.setResolver(domainName, resolverAddress, (error, transactionListenerId) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    })
  }
}

function setChainAddressForResolver (domainName, chain, chainAddress) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.setChainAddressForResolver(domainName, chain, chainAddress, (error, result) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    })
  }
}

function getChainAddresses (domainName) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.getChainAddressForResolvers(domainName, (error, result) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    })
  }
}

function requestDomainRegistration (domainName, yearsToRegister) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.requestRegistration(domainName, yearsToRegister, (error, result) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function canFinishRegistration (commitmentHash) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.canFinishRegistration(commitmentHash, (error, result) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function finishRegistration (domainName) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.finishRegistration(domainName, (error, transactionListenerId) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
        }
        return resolve(transactionListenerId);
      });
    });
  };
}

function getRegistrationCost (domainName, yearsToRegister) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.getDomainCost(domainName, yearsToRegister, (error, result) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function getUnapprovedTransactions () {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.getUnapprovedTransactions((error, transactions) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactions);
      });
    });
  };
}

function getSelectedAddress () {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.getSelectedAddress((error, selectedAddress) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
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
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        dispatch(niftyActions.hideLoadingIndication());
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

function navigateBack () {
  if (navigationStack && navigationStack.length > 0) {
    // we cleanup the last navigation since it was to the current page
    if (!backNavigated) {
      navigationStack.pop();
      backNavigated = true;
    }
    if (navigationStack.length > 0) {
      const navigation = navigationStack.pop();
      return navigateTo(navigation.data.screenName, navigation.data.params);
    }
  }
  // go to home since we don't have any other page to go to.
  return niftyActions.goHome();
}

function navigateTo (screenName, params) {
  const defaultParams = {
    showDomainsSearch: true,
  };

  const defaultNavBarParams = {
    showTitle: true,
    showBack: true,
  };

  params = extend(defaultParams, params);
  params.navBar = extend(defaultNavBarParams, params.navBar);

  if (params.navBar.showBack === false) {
    // we reset the navigation since we can't go back in the next page or any other after that
    for (let index = 0; index < navigationStack.length; index++) {
      navigationStack.pop();
    }
  }

  const currentNavigation = {
    type: rifActions.NAVIGATE_TO,
    data: {
      screenName,
      params,
    },
  }
  const alreadyNavigatedTo = navigationStack.find(navigation => navigation.data.screenName === screenName);
  if (!alreadyNavigatedTo) {
    navigationStack.push(currentNavigation);
  }
  backNavigated = false;
  return currentNavigation;
}

function getSubdomains (domainName) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.getSubdomainsForDomain(domainName, (error, result) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function waitForTransactionListener (transactionListenerId) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.rns.register.waitForTransactionListener(transactionListenerId, (error, transactionReceipt) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionReceipt);
      });
    });
  };
}

function createSubdomain (domainName, subdomain, ownerAddress, parentOwnerAddress) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.createSubdomain(domainName, subdomain, ownerAddress, parentOwnerAddress, (error, transactionListenerId) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    });
  };
}

function isSubdomainAvailable (domainName, subdomain) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.isSubdomainAvailable(domainName, subdomain, (error, available) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(available);
      });
    });
  };
}

function goToConfirmPageForLastTransaction (afterApproval) {
  return (dispatch) => {
    dispatch(waitUntil()).then(() => {
      dispatch(getUnapprovedTransactions())
        .then(latestTransaction => {
          dispatch(niftyActions.showConfTxPage({
            id: latestTransaction.id,
            unapprovedTransactions: latestTransaction,
            afterApproval,
          }));
      });
    });
  }
}

function deleteSubdomain (domainName, subdomain) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.deleteSubdomain(domainName, subdomain, (error, transactionListenerId) => {
        dispatch(niftyActions.hideLoadingIndication());
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    });
  };
}

function getDomain (domainName) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.getDomain(domainName, (error, domain) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(domain);
      });
    });
  };
}

function getDomains () {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.getDomains((error, domains) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(domains);
      });
    });
  };
}

function updateDomains (domain) {
  return (dispatch) => {
    dispatch(niftyActions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(niftyActions.hideLoadingIndication());
      background.rif.rns.register.updateDomain(domain, (error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve();
      });
    });
  };
}

// Lumino

function onboarding (callbackHandlers = new CallbackHandlers()) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.onboarding((error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        if (callbackHandlers && callbackHandlers.requestHandler) {
          handleSdkCallback(lumino.callbacks.REQUEST_CLIENT_ONBOARDING, dispatch, callbackHandlers.requestHandler);
        }
        if (callbackHandlers && callbackHandlers.successHandler) {
          handleSdkCallback(lumino.callbacks.CLIENT_ONBOARDING_SUCCESS, dispatch, callbackHandlers.successHandler);
        }
        return resolve();
      });
    });
  };
}

function handleSdkCallback (callbackName, dispatch, handler = null) {
  listenToSdkCallback(callbackName, dispatch)
    .then(result => {
      if (handler) {
        handler(result)
      }
    })
    .catch(error => {
      if (handler) {
        handler(error);
      }
    });
}

function listenToSdkCallback (callbackName, dispatch) {
  return new Promise((resolve, reject) => {
    background.rif.lumino.listenCallback(callbackName, (error, result) => {
      if (error) {
        dispatch(niftyActions.displayWarning(error));
        return reject(error);
      }
      return resolve(result);
    });
  });
}

function listenCallback (callbackName) {
  return (dispatch) => {
    return listenToSdkCallback(callbackName, dispatch);
  };
}

function getAvailableCallbacks () {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.getAvailableCallbacks((callbackNames, error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(callbackNames);
      });
    });
  };
}

function openChannel (partner, tokenAddress, callbackHandlers = new CallbackHandlers()) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.openChannel(partner, tokenAddress, (error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        if (callbackHandlers && callbackHandlers.requestHandler) {
          handleSdkCallback(lumino.callbacks.REQUEST_OPEN_CHANNEL, dispatch, callbackHandlers.requestHandler);
        }
        if (callbackHandlers && callbackHandlers.successHandler) {
          handleSdkCallback(lumino.callbacks.OPEN_CHANNEL, dispatch, callbackHandlers.successHandler);
        }
        if (callbackHandlers && callbackHandlers.errorHandler) {
          handleSdkCallback(lumino.callbacks.FAILED_OPEN_CHANNEL, dispatch, callbackHandlers.errorHandler);
        }
        return resolve();
      });
    });
  };
}

function closeChannel (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, callbackHandlers = new CallbackHandlers()) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.closeChannel(partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, (error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        if (callbackHandlers && callbackHandlers.requestHandler) {
          handleSdkCallback(lumino.callbacks.REQUEST_CLOSE_CHANNEL, dispatch, callbackHandlers.requestHandler);
        }
        if (callbackHandlers && callbackHandlers.successHandler) {
          handleSdkCallback(lumino.callbacks.CLOSE_CHANNEL, dispatch, callbackHandlers.successHandler);
        }
        if (callbackHandlers && callbackHandlers.errorHandler) {
          handleSdkCallback(lumino.callbacks.FAILED_CLOSE_CHANNEL, dispatch, callbackHandlers.errorHandler);
        }
        return resolve();
      });
    });
  };
}

function createDeposit (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount, callbackHandlers = new CallbackHandlers()) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.createDeposit(partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount, (error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        if (callbackHandlers && callbackHandlers.requestHandler) {
          handleSdkCallback(lumino.callbacks.REQUEST_DEPOSIT_CHANNEL, dispatch, callbackHandlers.requestHandler);
        }
        if (callbackHandlers && callbackHandlers.successHandler) {
          handleSdkCallback(lumino.callbacks.DEPOSIT_CHANNEL, dispatch, callbackHandlers.successHandler);
        }
        if (callbackHandlers && callbackHandlers.errorHandler) {
          handleSdkCallback(lumino.callbacks.FAILED_DEPOSIT_CHANNEL, dispatch, callbackHandlers.errorHandler);
        }
        return resolve();
      });
    });
  };
}

function createPayment (partner, tokenAddress, netAmount, callbackHandlers = new CallbackHandlers()) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.createPayment(partner, tokenAddress, netAmount, (error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        if (callbackHandlers && callbackHandlers.requestHandler) {
          handleSdkCallback(lumino.callbacks.SENT_PAYMENT, dispatch, callbackHandlers.requestHandler);
        }
        if (callbackHandlers && callbackHandlers.successHandler) {
          handleSdkCallback(lumino.callbacks.COMPLETED_PAYMENT, dispatch, callbackHandlers.successHandler);
        }
        if (callbackHandlers && callbackHandlers.errorHandler) {
          handleSdkCallback(lumino.callbacks.FAILED_CREATE_PAYMENT, dispatch, callbackHandlers.errorHandler);
          handleSdkCallback(lumino.callbacks.FAILED_PAYMENT, dispatch, callbackHandlers.errorHandler);
        }
        return resolve();
      });
    });
  };
}

function getChannels () {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.lumino.getChannels((channels, error) => {
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(channels);
      });
    });
  };
}

function getTokens () {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.luminoExplorer.getTokens((error, tokens) => {
        console.debug('TOKENS ============================================================================', tokens);
        console.debug('ERROR ============================================================================', error);
        if (error) {
          dispatch(niftyActions.displayWarning(error));
          return reject(error);
        }
        return resolve(tokens);
      });
    });
  };
}

module.exports = rifActions
