import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsJsDelegate from '../rnsjs-delegate'
import web3Utils from 'web3-utils';
import {generateDataHash, generateRandomSecret} from '../../utils/rns'

/**
 * This is a delegate to manage all the RNS register operations.
 */
export default class RnsRegister extends RnsJsDelegate {

  initialize () {
    this.fifsContractInstance = this.web3.eth.contract(FIFSRegistrar).at(this.rifConfig.rns.contracts.fifsRegistrar);
  }

  buildApi () {
    const rnsJsApi = super.buildApi();
    return {
      requestRegistration: this.bindOperation(this.requestRegistration, this),
      finishRegistration: this.bindOperation(this.finishRegistration, this),
      ...rnsJsApi,
    }
  }

  /**
   * Make a request for registration on the domainName for an amount of years.
   * @param domainName the Domain to register.
   * @param yearsToRegister the amount of years to register.
   * @returns {Promise<string>} secret to use on the finishRegistration operation.
   */
  requestRegistration (domainName, yearsToRegister) {
    const domainHash = web3Utils.sha3(domainName);
    const secret = generateRandomSecret();
    return new Promise((resolve, reject) => {
      this.call(this.fifsContractInstance, 'makeCommitment', [domainHash, this.address, secret])
        .then(commitment => {
          console.debug('Commitment received', commitment);
          this.sendTransaction(this.fifsContractInstance, 'commit', [commitment])
            .then(result => {
              console.debug('Commitment committed', result);
              const state = this.getStoreState();
              if (!state.register[this.address]) {
                state.register[this.address] = {};
              }
              state.register[this.address].domainRegister = {
                secret,
                domainName,
                yearsToRegister,
              };
              this.updateStoreState(state);
            }).catch(error => reject(error));
          resolve(secret);
        }).catch(error => reject(error));
    });
  }

  /**
   * Calculates the rif cost for a domain
   * It uses the formula here: https://github.com/rnsdomains/rns-rskregistrar#name-price
   * @param yearsToRegister
   */
  getDomainCost (yearsToRegister) {
    if (yearsToRegister && yearsToRegister > 0) {
      if (yearsToRegister === 1) {
        return 2;
      } else if (yearsToRegister === 2) {
        return 4;
      } else {
        const kMember = yearsToRegister - 2;
        return 4 + kMember;
      }
    } else {
      return -1;
    }
  }

  /**
   * This method checks if we can invoke finishRegistration, because that has to be invoked after some time so we can
   * check when we can invoke that method with these call.
   * @param secret the secret obtained on the requestRegistration call.
   * @returns {Promise<boolean>} a boolean indicating that we can reveal the commit or not.
   */
  canFinishRegistration (secret) {
    return new Promise((resolve, reject) => {
      this.call(this.fifsContractInstance, 'canReveal', [secret])
        .then(canReveal => {
          console.debug('Can Reveal Commit?', canReveal);
          resolve(canReveal);
        }).catch(error => reject(error));
    })
  }

  /**
   * Finish the domain registration using the hash from the requestRegistration operation.
   * @param domainName the Domain to be registered.
   * @param secret the secret hash generated on the first request.
   * @param yearsToRegister the amount of years to register the domain.
   * @returns {Promise<void>}
   */
  finishRegistration (domainName, yearsToRegister, secret) {
    const state = this.getStoreState();
    const domainRegister = state.register[this.address].domainRegister;
    if (domainRegister &&
      domainRegister.secret === secret &&
      domainRegister.yearsToRegister === yearsToRegister &&
      domainRegister.domainName === domainName) {
      const domainHash = web3Utils.sha3(domainName);
      const yearsToRegisterHash = web3Utils.sha3(web3Utils.toHex(yearsToRegister));
      return new Promise((resolve, reject) => {
        this.sendTransaction(this.fifsContractInstance, 'register', [domainHash, this.address, secret, yearsToRegisterHash])
          .then(result => {
            console.debug('Domain registered!', result);
            resolve(result);
          }).catch(error => reject(error));
      });
    } else {
      return Promise.reject('Invalid Secret domain or amount of years, you need to use the same as the first request');
    }
  }

}
