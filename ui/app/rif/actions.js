const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_INVOKE_CONTRACT_PAGE: 'SHOW_INVOKE_CONTRACT_PAGE',
  showDomainsPage,
  showPaymentsPage,
  showInvokeContractPage,
}
module.exports = rifActions

function showDomainsPage () {
  return {
    type: rifActions.SHOW_DOMAINS_PAGE,
  }
}

function showPaymentsPage () {
  return {
    type: rifActions.SHOW_PAYMENTS_PAGE,
  }
}

function showInvokeContractPage ({methodSelected, methodABI, inputValues}) {
  return {
    type: rifActions.SHOW_INVOKE_CONTRACT_PAGE,
    methodSelected,
    methodABI,
    inputValues,
  }
}
