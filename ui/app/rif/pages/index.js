import DomainsScreen from './domainsPage/domainsPage';
import DomainsDetailScreen from './domainsDetailPage/domainsDetailPage';
import Subdomains from './rns/subdomains';
import Exchange from './rns/exchange';
import LuminoChannels from './rns/lumino-channels';
import Pay from './rns/pay';
import Renew from './rns/renew';
import SellOnMKP from './rns/sell-on-mkp';
import Transfer from './rns/transfer';
import DomainRegisterScreen from './rns/register';
import LuminoTokensPage from './lumino/tokensPage/tokensPage';
import LuminoTokenDetailPage from './lumino/tokenDetailPage/tokenDetailPage';
import React from 'react';
import SearchDomains from '../components/searchDomains';
import rifActions from '../actions';
import ToastComponent from '../../../../old-ui/app/components/toast';
import ErrorComponent from '../../../../old-ui/app/components/error';

const pageNames = {
  rns: {
    domains: 'domains',
    domainsDetail: 'domainsDetail',
    domainRegister: 'domainRegister',
    subdomains: 'subdomains',
    exchange: 'exchange',
    luminoChannels: 'lumino-channels',
    pay: 'pay',
    renew: 'renew',
    sellOnMKP: 'sell-on-mkp',
    transfer: 'transfer',
    luminoTokensPage: 'luminoTokensPage',
    luminoTokenDetailPage: 'luminoTokenDetailPage',
  },
}

function buildScreen (screenComponent, context, dispatch) {
  let navBar = null;
  let searchDomains = null;

  if (context.params.navBar) {
    if (!context.params.navBar.title && context.params.navBar.showTitle) {
      context.params.navBar.title = context.screenName;
    }
    if (!context.params.navBar.backAction && context.params.navBar.showBack) {
      context.params.navBar.backAction = () => dispatch(rifActions.navigateBack());
    }
    let backButton = null;
    if (context.params.navBar.showBack || context.params.navBar.backAction) {
      backButton = (
        <i onClick={(event) => {
          context.params.navBar.backAction();
        }} className="fa fa-arrow-left fa-lg cursor-pointer" style={{
          position: 'absolute',
          left: '30px',
        }}/>
      );
    }
    let title = null;
    if (context.params.navBar.showTitle || context.params.navBar.title) {
      title = (<h2>{context.params.navBar.title}</h2>);
    }
    navBar = (
      <div className="section-title flex-row flex-center">
        {backButton}
        {title}
      </div>
    );
  }

  if (context.params.showDomainsSearch) {
    searchDomains = (<SearchDomains/>);
  }

  const screenBody = (
    <div className="flex-column flex-justify-center flex-grow select-none">
      {screenComponent}
    </div>
  );

  return (
    <div className="flex-column flex-grow" style={{
      maxWidth: '400px',
    }}>
      <ToastComponent />
      <ErrorComponent />
      {navBar}
      {searchDomains}
      {screenBody}
    </div>
  );
}

function getPage (context, dispatch) {
  switch (context.screenName) {
    case pageNames.rns.domains:
      return buildScreen(<DomainsScreen/>, context, dispatch)
    case pageNames.rns.domainsDetail:
      return buildScreen(<DomainsDetailScreen/>, context, dispatch)
    case pageNames.rns.subdomains:
      return buildScreen(<Subdomains/>, context, dispatch)
    case pageNames.rns.exchange:
      return buildScreen(<Exchange/>, context, dispatch)
    case pageNames.rns.luminoChannels:
      return buildScreen(<LuminoChannels/>, context, dispatch)
    case pageNames.rns.pay:
      return buildScreen(<Pay/>, context, dispatch)
    case pageNames.rns.renew:
      return buildScreen(<Renew/>, context, dispatch)
    case pageNames.rns.sellOnMKP:
      return buildScreen(<SellOnMKP/>, context, dispatch)
    case pageNames.rns.transfer:
      return buildScreen(<Transfer/>, context, dispatch)
    case pageNames.rns.domainRegister:
      return buildScreen(<DomainRegisterScreen/>, context, dispatch)
    case pageNames.rns.luminoTokensPage:
      return buildScreen(<LuminoTokensPage/>, context, dispatch)
    case pageNames.rns.luminoTokenDetailPage:
      return buildScreen(<LuminoTokenDetailPage/>, context, dispatch)
  }
}

export {
  getPage,
  pageNames,
}
