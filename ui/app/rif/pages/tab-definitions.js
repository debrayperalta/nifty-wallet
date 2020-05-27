// default view of panels
import DomainsScreen from './domainsPage/domainsPage';
import LuminoHome from './lumino';
import React from 'react';

export const tabDefinitions = [
  {
    title: 'Domains',
    index: 1,
    defaultTitle: 'My Domains',
    defaultComponent: (<DomainsScreen />),
    showSearchbar: true,
  },
  {
    title: 'Lumino',
    index: 2,
    defaultTitle: 'Lumino networks directory',
    defaultComponent: (<LuminoHome />),
    showSearchbar: true,
  },
]
