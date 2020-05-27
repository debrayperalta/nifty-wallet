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
import React from 'react';
import SearchDomains from '../components/searchDomains';
import rifActions from '../actions';
import {tabDefinitions} from './tab-definitions';
import Tabs from '../components/tabs'

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
  },
}

function getSearchBarComponent (show) {
  if (!show) {
    return null;
  }
  return (<SearchDomains />);
}

function getTabTitleComponent (title) {
  if (!title) {
    return null;
  }
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}

function buildTabs (screenComponent, params) {
  const tabs = [];

  tabDefinitions.forEach((tabDefinition, index) => {
    let tabTitle = tabDefinition.defaultTitle;
    let tabComponent = tabDefinition.defaultComponent;
    if (screenComponent) {
      const tabIndex = params.tabIndex;
      const screenTitle = params.title;
      if (tabDefinition.index === tabIndex) {
        tabTitle = screenTitle;
        tabComponent = screenComponent;
      }
    }
    const tab = {
      index,
      title: tabDefinition.title,
      component: (
        <div>
          {getSearchBarComponent(tabDefinition.showSearchbar)}
          {getTabTitleComponent(tabTitle)}
          {tabComponent}
        </div>
      ),
    };
    tabs.push(tab);
  });

  return tabs;
}

function buildTabScreen (screenComponent, context, dispatch) {
  const params = context.params;
  const tabs = buildTabs(screenComponent, params, dispatch);
  const onTabChange = (tab) => {
    // we can use this to trigger on change tab actions
    console.debug('Selected tab', tab);
  }
  return (
    <div className="rif-app-container">
      <Tabs tabs={tabs}
            onChange={(tab) => onTabChange(tab)}
            showBack={params.showBack}
            backAction={() => dispatch(rifActions.navigateBack())}/>
    </div>
  );
}

function getLandingPage (context, dispatch) {
  return buildTabScreen(null, context, dispatch);
}

function getPage (context, dispatch) {
  switch (context.params.name) {
    case pageNames.rns.domains:
      return buildTabScreen(<DomainsScreen/>, context, dispatch);
    case pageNames.rns.domainsDetail:
      return buildTabScreen(<DomainsDetailScreen/>, context, dispatch);
    case pageNames.rns.subdomains:
      return buildTabScreen(<Subdomains/>, context, dispatch);
    case pageNames.rns.exchange:
      return buildTabScreen(<Exchange/>, context, dispatch);
    case pageNames.rns.luminoChannels:
      return buildTabScreen(<LuminoChannels/>, context, dispatch);
    case pageNames.rns.pay:
      return buildTabScreen(<Pay/>, context, dispatch);
    case pageNames.rns.renew:
      return buildTabScreen(<Renew/>, context, dispatch);
    case pageNames.rns.sellOnMKP:
      return buildTabScreen(<SellOnMKP/>, context, dispatch);
    case pageNames.rns.transfer:
      return buildTabScreen(<Transfer/>, context, dispatch);
    case pageNames.rns.domainRegister:
      return buildTabScreen(<DomainRegisterScreen/>, context, dispatch);
    case pageNames.rns.luminoTokensPage:
      return buildTabScreen(<LuminoTokensPage/>, context, dispatch);
    default:
      return buildTabScreen(null, context, dispatch);
  }
}

export {
  getPage,
  pageNames,
  getLandingPage,
}
