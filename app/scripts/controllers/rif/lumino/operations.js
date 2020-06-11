import {toChecksumAddress, toWei} from 'web3-utils';
import {checkRequiredParameters, checksumAddresses} from '../utils/general';
import {isValidRNSDomain} from '../../../../../ui/app/rif/utils/parse';

export class LuminoOperations {

  constructor (lumino) {
    this.lumino = lumino;
  }

  onboarding () {
    console.debug('Onboarding Client');
    return new Promise((resolve, reject) => {
      this.lumino.get().actions.onboardingClient()
        .then(() => {
          resolve();
        }).catch(error => reject(error));
    });
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
    const errors = checkRequiredParameters({
      partner,
      tokenAddress,
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    const params = {
      ...checksumAddresses({partner, tokenAddress}),
      settleTimeout: 500,
    };
    console.debug(`Request to open a channel with partner ${partner} on token ${tokenAddress}`);
    this.lumino.get().actions.openChannel(params);
    return Promise.resolve();
  }

  closeChannel (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier) {
    const errors = checkRequiredParameters({
      partner,
      tokenAddress,
      address,
      tokenNetworkAddress,
      channelIdentifier,
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    const params = {
      ...checksumAddresses({partner, tokenAddress, address, tokenNetworkAddress}),
      channelIdentifier,
    };
    console.debug('Requesting to close channel', params);
    this.lumino.get().actions.closeChannel(params);
    return Promise.resolve();
  }

  createDeposit (partner, tokenAddress, address, tokenNetworkAddress, channelIdentifier, netAmount) {
    const errors = checkRequiredParameters({
      partner,
      tokenAddress,
      address,
      tokenNetworkAddress,
      channelIdentifier,
      netAmount,
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    const amount = toWei(netAmount);
    if (!isValidRNSDomain(partner)) {
      partner = toChecksumAddress(partner);
    }
    const params = {
      ...checksumAddresses({tokenAddress, address, tokenNetworkAddress}),
      amount,
      partner,
      channelId: channelIdentifier,
    };
    console.debug(`Requested deposit of ${amount} on token ${tokenAddress} on channel ${channelIdentifier} with partner ${partner}`);
    this.lumino.get().actions.createDeposit(params);
    return Promise.resolve();
  }

  createPayment (partner, tokenAddress, netAmount) {
    const errors = checkRequiredParameters({
      partner,
      tokenAddress,
      netAmount,
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    const amount = toWei(netAmount);
    if (!isValidRNSDomain(partner)) {
      partner = toChecksumAddress(partner);
    }
    const body = {
      ...checksumAddresses({token_address: tokenAddress}),
      partner,
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
