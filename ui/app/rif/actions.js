const rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
<<<<<<< HEAD
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
=======
  SHOW_CONFIRMATION_MESSAGE: 'SHOW_CONFIRMATION_MESSAGE',
  HIDE_CONFIRMATION_MESSAGE: 'HIDE_CONFIRMATION_MESSAGE',
>>>>>>> ad6101bd21c337d5e05a01361722db2243ab369b
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
  showConfirmationMessage,
  hideConfirmationMessage,
}

function showDomainsPage () {
  return {
    type: rifActions.SHOW_DOMAINS_PAGE,
  }
}

<<<<<<< HEAD
function showDomainsDetailPage (data) {
  return {
    type: rifActions.SHOW_DOMAINS_DETAIL_PAGE,
    value: {
      value: data,
    }
  }
}
  
=======
>>>>>>> ad6101bd21c337d5e05a01361722db2243ab369b
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
