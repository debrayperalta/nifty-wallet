export function buildActions (background, niftyActions, rifActions) {

  const luminoActions = {
    onboarding,
    listenCallback,
    getAvailableCallbacks,
    openChannel,
    closeChannel,
    getChannels,
    createDeposit,
    createPayment,
  };

  function onboarding () {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.onboarding((error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve();
        });
      });
    };
  }

  function listenCallback (callbackName) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.listenCallback(callbackName, (result, error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve(result);
        });
      });
    };
  }

  function getAvailableCallbacks () {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.getAvailableCallbacks((callbackNames, error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve(callbackNames);
        });
      });
    };
  }

  function openChannel (partner, tokenAddress) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.openChannel(partner, tokenAddress, (error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve();
        });
      });
    };
  }

  function closeChannel (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.closeChannel(partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, (error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve();
        });
      });
    };
  }

  function createDeposit (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.createDeposit(partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount, (error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve();
        });
      });
    };
  }

  function createPayment (partner, tokenAddress, netAmount) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.createPayment(partner, tokenAddress, netAmount, (error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve();
        });
      });
    };
  }

  function getChannels () {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        background.rif.lumino.getChannels((channels, error) => {
          if (error) {
            dispatch(niftyActions.displayWarning(error));
            return reject(error);
          }
          return resolve(channels);
        });
      });
    };
  }

  return {
    ...rifActions,
    ...luminoActions,
  };

}
