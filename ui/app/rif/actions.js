var rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  SHOW_DOMAINS_DETAIL_PAGE: 'SHOW_DOMAINS_DETAIL_PAGE',
  showDomainsPage,
  showDomainsDetailPage,
  showPaymentsPage,
}
module.exports = rifActions

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
  
function showPaymentsPage () {
  return {
    type: rifActions.SHOW_PAYMENTS_PAGE,
  }
}