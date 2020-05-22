import {lumino} from '../../../../../rif.config';

const ENDPOINT_EXPLORER_DASHBOARD = '/dashboard';

export class LuminoExplorer {
  getTokens () {
    return new Promise((resolve, reject) => {
      fetch(lumino.explorer.endpoint + ENDPOINT_EXPLORER_DASHBOARD)
        .then(response => {
          return response.json();
        })
        .then(dashBoardInfo => {
          resolve(dashBoardInfo.tokens);
        }).catch(err => reject(err));
    });
  }
  getChannelsForToken (tokenAddress) {
    return new Promise((resolve, reject) => {
      this.getTokens()
        .then(response => {
          return response.json();
        })
        .then(dashBoardInfo => {
          dashBoardInfo.tokens.map((token, index) => {
            if (token.address === tokenAddress) {
              resolve(token)
            }
          })
          reject('Not found')
        }).catch(err => reject(err));
    });
  }
}
