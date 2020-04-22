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
   * @returns {Promise<string>} commitHash to use on the finishRegistration operation.
   */
  requestRegistration (domainName, yearsToRegister) {
    const domainHash = web3Utils.sha3(domainName);
    const secret = generateRandomSecret();

    return new Promise((resolve, reject) => {
      this.fifsContractInstance['makeCommitment']
        .call(domainHash, this.address, secret, (error, commitment) => {
          if (error) {
            reject(error);
          }
          console.debug('Commitment: ' + commitment);

          const transaction = {
            from: this.address,
            to: this.rifConfig.rns.contracts.registrar,
            gas: '200000',
            data: generateDataHash('commit(bytes32)', [commitment]),
          };

          this.transactionController.newUnapprovedTransaction(transaction);

          resolve(secret);
      });
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
