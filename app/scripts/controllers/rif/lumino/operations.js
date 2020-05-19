import {toWei} from 'web3-utils';

export class LuminoOperations {

  constructor (lumino) {
    this.lumino = lumino;
  }

  onboarding () {
    console.debug('Onboarding Client');
    this.lumino.get().actions.onboardingClient();
    return Promise.resolve();
  }

  getApiKey () {
    console.debug('Getting api key');
    return Promise.resolve(this.lumino.get().actions.getApiKey());
  }

  setApiKey (apiKey) {
    console.debug('Setting api key', apiKey);
    this.lumino.get().actions.setApiKey(apiKey);
    return Promise.resolve();
  }

  openChannel (partner, tokenAddress) {
    const params = {
      partner,
      settleTimeout: 500,
      tokenAddress,
    };
    console.debug(`Request to open a channel with partner ${partner} on token ${tokenAddress}`);
    this.lumino.get().actions.openChannel(params);
    return Promise.resolve();
  }

  closeChannel (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier) {
    const params = {
      partner,
      tokenAddress,
      address,
      tokenNetworkAddress,
      channelIdentifier,
    };
    console.debug('Requesting to close channel', params);
    this.lumino.get().actions.closeChannel(params);
    return Promise.resolve();
  }

  createDeposit (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount) {
    const amount = toWei(netAmount);
    const params = {
      tokenAddress,
      tokenNetworkAddress,
      amount,
      channelId: channelIdentifier,
      partner,
    };
    console.debug(`Requested deposit of ${amount} on token ${tokenAddress} on channel ${channelIdentifier} with partner ${partner}`);
    this.lumino.get().actions.createDeposit(params);
    return Promise.resolve();
  }

  createPayment (partner, tokenAddress, netAmount) {
    const amount = toWei(netAmount);
    const body = {
      partner,
      token_address: tokenAddress,
      amount,
    };
    console.debug(`Sending payment of ${amount} on token ${tokenAddress} to ${partner}`);
    this.lumino.get().actions.createPayment(body);
    return Promise.resolve();
  }

  getChannels () {
    return Promise.resolve(this.lumino.get().actions.getChannels());
  }
}
