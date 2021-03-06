const actions = require('../actions');
import extend from 'xtend'

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
    dispatch(actions.showLoadingIndication());
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
    dispatch(actions.showLoadingIndication());
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
    dispatch(actions.showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.setResolver(domainName, resolverAddress, (error, transactionListenerId) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    })
  }
}

function setChainAddressForResolver (domainName, chain, chainAddress) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication());
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.setChainAddressForResolver(domainName, chain, chainAddress, (error, result) => {
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

function getChainAddresses (domainName) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      background.rif.rns.resolver.getChainAddressForResolvers(domainName, (error, result) => {
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
      background.rif.rns.register.requestRegistration(domainName, yearsToRegister, (error, result) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
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
          dispatch(actions.displayWarning(error));
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
      background.rif.rns.register.finishRegistration(domainName, (error, transactionListenerId) => {
        if (error) {
          dispatch(actions.displayWarning(error));
        }
        return resolve(transactionListenerId);
      });
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
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(result);
      });
    });
  };
}

function getUnapprovedTransactions () {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.getUnapprovedTransactions((error, transactions) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
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
          dispatch(actions.displayWarning(error));
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
  return actions.goHome();
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
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.getSubdomainsForDomain(domainName, (error, result) => {
        if (error) {
          dispatch(actions.displayWarning(error));
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
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionReceipt);
      });
    });
  };
}

function createSubdomain (domainName, subdomain, ownerAddress, parentOwnerAddress) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.createSubdomain(domainName, subdomain, ownerAddress, parentOwnerAddress, (error, transactionListenerId) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    });
  };
}

function isSubdomainAvailable (domainName, subdomain) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.isSubdomainAvailable(domainName, subdomain, (error, available) => {
        if (error) {
          dispatch(actions.displayWarning(error));
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
          dispatch(actions.showConfTxPage({
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
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      background.rif.rns.register.deleteSubdomain(domainName, subdomain, (error, transactionListenerId) => {
        dispatch(actions.hideLoadingIndication());
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(transactionListenerId);
      });
    });
  };
}

function getDomain (domainName) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.getDomain(domainName, (error, domain) => {
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(domain);
      });
    });
  };
}

function getDomains () {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.getDomains((error, domains) => {
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve(domains);
      });
    });
  };
}

function updateDomains (domain) {
  return (dispatch) => {
    dispatch(actions.showLoadingIndication())
    return new Promise((resolve, reject) => {
      dispatch(actions.hideLoadingIndication());
      background.rif.rns.register.updateDomain(domain, (error) => {
        if (error) {
          dispatch(actions.displayWarning(error));
          return reject(error);
        }
        return resolve();
      });
    });
  };
}

module.exports = rifActions
