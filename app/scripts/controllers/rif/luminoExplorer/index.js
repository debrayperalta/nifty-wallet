import {AbstractManager} from '../abstract-manager';
import {bindOperation} from '../utils/general';

// Todo Rodrigo
// Mover todas las rutas a un archivo de config
const ENDPOINT_EXPLORER = 'http://localhost:8080';
const API_V1_VERSION_PATH = '/api/v1/';
const ENDPOINT_EXPLORER_DASHBOARD = 'dashboard';
const ENDPOINT_EXPLORER_CHANNELS = 'channel';

export class LuminoExplorer extends AbstractManager {
  constructor (props) {
    super(props, {
      apiKey: null,
    });
  }
  getTokens () {
    return new Promise((resolve, reject) => {
      fetch(ENDPOINT_EXPLORER + API_V1_VERSION_PATH + ENDPOINT_EXPLORER_DASHBOARD)
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
          // Todo Rodrigo
          // Devolver error porque no encontro el token
          reject('ERROR')
        }).catch(err => reject(err));
    });
  }
  // TODO Rodrigo
  // Enviar el tokenAddress, es opcional
  getChannels (tokenAddress) {
    return new Promise((resolve, reject) => {
      fetch(ENDPOINT_EXPLORER + API_V1_VERSION_PATH + ENDPOINT_EXPLORER_CHANNELS)
        .then(response => {
          return response.json();
        })
        .then(channels => {
          resolve(channels);
        }).catch(err => reject(err));
    });
  }
  bindApi () {
    return {
      getTokens: bindOperation(this.getTokens, this),
    };
  }
}
