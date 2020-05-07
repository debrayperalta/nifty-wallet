import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsJsDelegate from '../rnsjs-delegate'
import web3Utils from 'web3-utils';
import {generateRandomSecret, numberToUint32, utf8ToHexString} from '../../utils/rns'
import {namehash} from '@rsksmart/rns/lib/utils'

/**
 * This is a delegate to manage all the RNS register operations.
 */
export default class RnsRegister extends RnsJsDelegate {

  initialize () {
    this.fifsAddrRegistrarInstance = this.web3.eth.contract(FIFSRegistrar).at(this.rifConfig.rns.contracts.fifsAddrRegistrar);
  }

  buildApi () {
    const rnsJsApi = super.buildApi();
    return {
      requestRegistration: this.bindOperation(this.requestRegistration, this),
      finishRegistration: this.bindOperation(this.finishRegistration, this),
      canFinishRegistration: this.bindOperation(this.canFinishRegistration, this),
      getDomainCost: this.bindOperation(this.getDomainCost, this),
      createSubdomain: this.bindOperation(this.createSubdomain, this),
      ...rnsJsApi,
    }
  }

  /**
   * Make a request for registration on the domainName for an amount of years.
   * @param domainName the Domain to register.
   * @param yearsToRegister the amount of years to register.
   * @returns {Promise<string>} commitment that helps is to check if you can finish registration or you still have to wait.
   */
  requestRegistration (domainName, yearsToRegister) {
    const cleanDomainName = this.cleanDomainFromRskSuffix(domainName);
    const domainHash = web3Utils.sha3(cleanDomainName);
    const secret = generateRandomSecret();
    return new Promise((resolve, reject) => {
      this.getDomainCost(cleanDomainName, yearsToRegister)
        .then(rifCost => {
          this.call(this.fifsAddrRegistrarInstance, 'makeCommitment', [domainHash, this.address, secret])
            .then(commitment => {
              console.debug('Commitment received', commitment);
              this.send(this.fifsAddrRegistrarInstance, 'commit', [commitment])
                .then(transactionListener => {
                  transactionListener.mined().then(transactionReceipt => {
                    const state = this.getStoreState();
                    if (!state.register[this.address]) {
                      state.register[this.address] = {
                        domainRegister: [],
                      };
                    }
                    state.register[this.address].domainRegister[cleanDomainName] = {
                      secret,
                      yearsToRegister,
                      rifCost,
                    };
                    this.updateStoreState(state);
                  }).catch(transactionReceipt => {
                    console.debug('Transaction Failed', transactionReceipt);
                  });
                }).catch(error => reject(error));
              resolve(commitment);
            }).catch(error => reject(error));
        }).catch(error => reject(error));
    });
  }

  /**
   * Calculates the rif cost for a domain
   * It uses the formula here: https://github.com/rnsdomains/rns-rskregistrar#name-price
   * @param domainName the domain name to ask for
   * @param yearsToRegister the amount of years to ask
   * @returns registration cost in RIF (wei)
   */
  getDomainCost (domainName, yearsToRegister) {
    const cleanDomainName = this.cleanDomainFromRskSuffix(domainName);
    return this.call(this.fifsAddrRegistrarInstance, 'price', [cleanDomainName, 0, yearsToRegister]);
  }

  /**
   * This method checks if we can invoke finishRegistration, because that has to be invoked after some time so we can
   * check when we can invoke that method with these call.
   * @param commitment the commitment hash obtained on the requestRegistration call.
   * @returns {Promise<boolean>} a boolean indicating that we can reveal the commit or not.
   */
  canFinishRegistration (commitment) {
    return new Promise((resolve, reject) => {
      this.call(this.fifsAddrRegistrarInstance, 'canReveal', [commitment])
        .then(canReveal => {
          console.debug('Can Reveal Commit?', canReveal);
          resolve(canReveal);
        }).catch(error => reject(error));
    })
  }

  /**
   * Finish the domain registration using the data stored with the domainName key on the requestRegistration operation.
   * @param domainName the Domain to be registered.
   * is used to do something after the user submits the operation and the domain it's registered
   * @returns {Promise<void>}
   */
  finishRegistration (domainName) {
    const cleanDomainName = this.cleanDomainFromRskSuffix(domainName);
    const state = this.getStoreState();
    const registerByAddress = state.register[this.address];
    if (registerByAddress) {
      const registerInformation = registerByAddress.domainRegister[cleanDomainName];
      if (registerInformation) {
        const rifCost = registerInformation.rifCost;
        const secret = registerInformation.secret;
        const durationBN = this.web3.toBigNumber(registerInformation.yearsToRegister);
        const data = this.getAddrRegisterData(cleanDomainName, this.address, secret, durationBN, this.address);
        const result = this.send(this.rifContractInstance, 'transferAndCall', [this.rifConfig.rns.contracts.fifsAddrRegistrar, rifCost.toString(), data]);
        result.then(transactionListener => {
          transactionListener.mined().then(transactionReceipt => {
            console.debug('Transaction success', transactionReceipt);
          }).catch(transactionReceipt => {
            console.debug('Transaction failed', transactionReceipt);
          });
        })
        return result;
      } else {
        return Promise.reject('Invalid domainName, you need to use the same as the first request');
      }
    } else {
      return Promise.reject('You dont have any registration pending, you need to request registration first');
    }
  }

  /**
   * registration with rif transferAndCall encoding
   * @param {string} name to register
   * @param {address} owner of the new name
   * @param {hex} secret of the commit
   * @param {BN} duration to register in years
   */
  getAddrRegisterData = (name, owner, secret, duration, addr) => {
    // 0x + 8 bytes
    const dataSignature = '0x5f7b99d5';

    // 20 bytes
    const dataOwner = owner.toLowerCase().slice(2);

    // 32 bytes
    let dataSecret = secret.slice(2);
    const padding = 64 - dataSecret.length;
    for (let i = 0; i < padding; i += 1) {
      dataSecret += '0';
    }

    // 32 bytes
    const dataDuration = numberToUint32(duration);

    // variable length
    const dataName = utf8ToHexString(name);

    // 20 bytes
    const dataAddr = addr.toLowerCase().slice(2);

    return `${dataSignature}${dataOwner}${dataSecret}${dataDuration}${dataAddr}${dataName}`;
  };

  /**
   * registration with rif transferAndCall encoding
   * @param {string} name to register
   * @param {address} owner of the new name
   * @param {hex} secret of the commit
   * @param {BN} duration to register in years
   */
  getRegisterData (name, owner, secret, duration) {
    // 0x + 8 bytes
    const dataSignature = '0xc2c414c8';

    // 20 bytes
    const dataOwner = owner.toLowerCase().slice(2);

    // 32 bytes
    const dataSecret = secret.slice(2);

    // 32 bytes
    const dataDuration = numberToUint32(duration);

    // variable length
    const dataName = utf8ToHexString(name);

    return `${dataSignature}${dataOwner}${dataSecret}${dataDuration}${dataName}`;
  }

  /**
   * Overrides the parent operation because rns-js is failing on this, we invoke the contract directly.
   */
  createSubdomain (domainName, subdomain, ownerAddress, parentOwnerAddress) {
    domainName = this.addRskSuffix(domainName);
    if (!ownerAddress) {
      ownerAddress = this.address;
    }
    const node = namehash(domainName);
    const label = web3Utils.sha3(subdomain);
    const result = this.send(this.rnsContractInstance, 'setSubnodeOwner', [node, label, ownerAddress])
    result.then(transactionListener => {
      transactionListener.mined().then(transactionReceipt => {
        const subdomains = this.getSubdomains(domainName);
        subdomains.push({
          domainName,
          name: subdomain,
          ownerAddress,
          parentOwnerAddress,
        });
        this.updateSubdomains(domainName, subdomains);
      }).catch(transactionReceipt => {
        console.log('Transaction failed', transactionReceipt);
      });
    }).catch(error => {
      console.log(error);
    });
    return result;
  }

}
