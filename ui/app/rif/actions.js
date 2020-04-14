const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_CONFIRMATION_MESSAGE: 'SHOW_CONFIRMATION_MESSAGE',
  HIDE_CONFIRMATION_MESSAGE: 'HIDE_CONFIRMATION_MESSAGE',
  showDomainsPage,
  showPaymentsPage,
  showConfirmationMessage,
  hideConfirmationMessage,
}

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
