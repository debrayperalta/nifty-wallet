var rifActions = {
  SHOW_DOMAINS_PAGE: 'SHOW_DOMAINS_PAGE',
  SHOW_PAYMENTS_PAGE: 'SHOW_PAYMENTS_PAGE',
  showDomainsPage,
  showPaymentsPage,
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