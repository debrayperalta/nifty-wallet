import {CALLBACKS} from '@rsksmart/lumino-light-client-sdk/dist/utils/callbacks';

export class LuminoCallbacks {

  callbackNames = Object.keys(CALLBACKS).map(callbackKey => CALLBACKS[callbackKey]);

  constructor (lumino) {
    this.lumino = lumino;
  }

  listenForCallback (callbackName) {
    return new Promise((resolve, reject) => {
      if (this.callbackNames.indexOf(name => callbackName === name)) {
        this.lumino.callbacks.set(callbackName, (result, error) => {
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
