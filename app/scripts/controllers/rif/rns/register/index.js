import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsJsDelegate from '../rnsjs-delegate'

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
   * @returns {Promise<string>} commitHash to use on the finishRegistration operation.
   */
  requestRegistration (domainName, yearsToRegister) {
    const domainHash = this.web3.utils.sha3(domainName);
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(32));
    const strSalt = Array.from(randomBytes).map(byte => byte.toString(16)).join('');
    const secret = `0x${strSalt.padEnd(64, '0')}`;

    return new Promise((resolve, reject) => {
      this.fifsContractInstance['makeCommitment']
        .call(domainHash, this.address, secret, (error, commitment) => {
          if (error) {
            reject(error);
          }
          console.debug('Commitment: ' + commitment);
          this.fifsContractInstance['commit'].send({
            commitment: commitment,
          }, (error, commitHash) => {
            if (error) {
              reject(error);
            }
            console.debug('Commitment committed, wait 1 minute before reveal');
            console.debug(commitHash);
            const state = this.getStoreState();
            state.register[this.address].domainRegister = {
              domainName,
              secret,
              yearsToRegister,
            }
            this.updateStoreState(state);
            resolve(commitHash);
          });
      });
    });
  }

  /**
   * Finish the domain registration using the hash from the requestRegistration operation.
   * @param domainName the Domain to be registered.
   * @param secret the secret hash generated on the first request.
   * @param yearsToRegister the amount of years to register the domain.
   * @returns {Promise<void>}
   */
  finishRegistration (domainName, secret, yearsToRegister) {
    const state = this.getStoreState();
    const domainRegister = state.register[this.address].domainRegister;
    if (domainRegister &&
      domainRegister.secret === secret &&
      domainRegister.yearsToRegister === yearsToRegister &&
      domainRegister.domainName === domainName) {
      return new Promise((resolve, reject) => {
        this.fifsContractInstance['register']
          .send(domainName, this.address, secret, yearsToRegister, (error, hash) => {
            if (error) {
              reject(error);
            }
            console.debug(hash);
            console.debug('Domain registered!');
            resolve();
          });
      });
    } else {
      return Promise.reject('Invalid Secret domain or amount of years, you need to use the same as the first request');
    }
  }

}
