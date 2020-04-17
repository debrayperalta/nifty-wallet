import * as namehash from 'eth-ens-namehash'
import {DEFAULT_ADDRESS} from '../index'
import RnsDelegate from '../rns-delegate'

export default class RnsResolver extends RnsDelegate {
  getOwner (domainName) {
    return new Promise((resolve, reject) => {
      this.rnsContractInstance.methods.owner(namehash.hash(domainName + '.rsk'))
        .call({})
        .then(address => {
          console.debug('Owner Address', address);
          resolve(address);
        }).catch(error => reject(error));
    });
  }

  available (domainName) {
    return new Promise((resolve, reject) => {
      this.getOwner(domainName)
        .then(address => {
          const available = address === DEFAULT_ADDRESS;
          console.debug('Domain available ', available);
          resolve(available);
        }).catch(error => reject(error));
    });
  }

  isOwner (domainName, address) {
    return new Promise((resolve, reject) => {
      this.getOwner(domainName)
        .then(ownerAddress => {
          const isOwner = ownerAddress === address;
          console.debug(address + ' is Owner? = ' + isOwner);
          resolve(isOwner);
        }).catch(error => reject(error));
    });
  }

  getApi () {
    return {
      getOwner: this.getOwner.bind(this),
      available: this.available.bind(this),
      isOwner: this.isOwner.bind(this),
    }
  }
}
