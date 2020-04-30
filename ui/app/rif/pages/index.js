import h from 'react-hyperscript';
import DomainsScreen from './domainsPage/domainsPage';
import PaymentsScreen from './paymentsPage/paymentsPage';
import DomainsDetailScreen from './domainsDetailPage/domainsDetailPage';
import Subdomains from './rns/subdomains';
import Exchange from './rns/exchange';
import LuminoChannels from './rns/lumino-channels';
import Pay from './rns/pay';
import Renew from './rns/renew';
import SellOnMKP from './rns/sell-on-mkp';
import Transfer from './rns/transfer';

const pageNames = {
  rns: {
    domains: 'domains',
    domainsDetail: 'domainsDetail',
    domainRegister: 'domainRegister',
    payments: 'payments',
    subdomains: 'subdomains',
    exchange: 'exchange',
    luminoChannels: 'lumino-channels',
    pay: 'pay',
    renew: 'renew',
    sellOnMKP: 'sell-on-mkp',
    transfer: 'transfer',
  },
}

function buildScreen (screenComponent, currentView) {
  return h(screenComponent, {key: currentView.screenName})
}

function getPage (context) {
  switch (context.screenName) {
    case pageNames.rns.domains:
      return buildScreen(DomainsScreen, context);
    case pageNames.rns.domainsDetail:
      return buildScreen(DomainsDetailScreen, context);
    case pageNames.rns.payments:
      return buildScreen(PaymentsScreen, context);
    case pageNames.rns.subdomains:
      return buildScreen(Subdomains, context);
    case pageNames.rns.exchange:
      return buildScreen(Exchange, context);
    case pageNames.rns.luminoChannels:
      return buildScreen(LuminoChannels, context);
    case pageNames.rns.pay:
      return buildScreen(Pay, context);
    case pageNames.rns.renew:
      return buildScreen(Renew, context);
    case pageNames.rns.sellOnMKP:
      return buildScreen(SellOnMKP, context);
    case pageNames.rns.transfer:
      return buildScreen(Transfer, context);
  }
}

export {
  getPage,
  pageNames,
}
