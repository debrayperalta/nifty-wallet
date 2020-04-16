const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE: 'SHOW_ADD_NEW_MULTICRYPTO_ADDRESS_PAGE',
  SHOW_RIF_MODAL: 'SHOW_RIF_MODAL',
  HIDE_RIF_MODAL: 'HIDE_RIF_MODAL',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showAddNewMulticryptoAddressPage,
  showRifModal,
  hideRifModal,
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

function showRifModal (message) {
  return {
    type: rifActions.SHOW_RIF_MODAL,
    message: message,
  }
}

function hideRifModal () {
  return {
    type: rifActions.HIDE_RIF_MODAL,
  }
}

module.exports = rifActions
