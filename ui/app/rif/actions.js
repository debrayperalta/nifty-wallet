const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE: 'SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE',
  SHOW_CONFIRMATION_MESSAGE: 'SHOW_CONFIRMATION_MESSAGE',
  HIDE_CONFIRMATION_MESSAGE: 'HIDE_CONFIRMATION_MESSAGE',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showAddNewMulticryptoAddressPage,
  showConfirmationMessage,
  hideConfirmationMessage,
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
    }
  }
}

function showAddNewMulticryptoAddressPage (domain, selectedResolverIndex) {
  return {
    type: rifActions.SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE,
    value: {
      value: {
        domain: domain,
        selectedResolverIndex: selectedResolverIndex,
      },
    }
  }
}
  
function showPaymentsPage () {
  return {
    type: rifActions.SHOW_PAYMENTS_PAGE,
  }
}

function showConfirmationMessage (message) {
  return {
    type: rifActions.SHOW_CONFIRMATION_MESSAGE,
    message: message,
  }
}

function hideConfirmationMessage () {
  return {
    type: rifActions.HIDE_CONFIRMATION_MESSAGE,
  }
}

module.exports = rifActions
