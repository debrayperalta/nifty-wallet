const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  SHOW_CONFIRMATION_MESSAGE: 'SHOW_CONFIRMATION_MESSAGE',
  HIDE_CONFIRMATION_MESSAGE: 'HIDE_CONFIRMATION_MESSAGE',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showConfirmationMessage,
  hideConfirmationMessage,
  setBackgroundConnection,
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
