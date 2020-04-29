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

function buildScreen (screenComponent, currentView) {
  return h(screenComponent, {key: currentView.screenName})
}

function getPage (context) {
  switch (context.screenName) {
    case 'domains':
      return buildScreen(DomainsScreen, context);
    case 'domainsDetail':
      return buildScreen(DomainsDetailScreen, context);
    case 'payments':
      return buildScreen(PaymentsScreen, context);
    case 'subdomains':
      return buildScreen(Subdomains, context);
    case 'exchange':
      return buildScreen(Exchange, context);
    case 'lumino-channels':
      return buildScreen(LuminoChannels, context);
    case 'pay':
      return buildScreen(Pay, context);
    case 'renew':
      return buildScreen(Renew, context);
    case 'sell-on-mkp':
      return buildScreen(SellOnMKP, context);
    case 'transfer':
      return buildScreen(Transfer, context);
  }
}

export {
  getPage,
}
