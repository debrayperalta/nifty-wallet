import {CALLBACKS} from '@rsksmart/lumino-light-client-sdk/dist/utils/callbacks';

export class LuminoCallbacks {
  constructor (lumino) {
    this.lumino = lumino;
  }

  getAvailableCallbacks () {
    return Promise.resolve(Object.keys(CALLBACKS));
  }

  listenForCallback (callbackName) {
    return new Promise((resolve, reject) => {
      if (CALLBACKS[callbackName]) {
        this.lumino.callbacks.set(CALLBACKS[callbackName], (result, error) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
      } else {
        return reject('No callback found with that name');
      }
    });
  }
}
