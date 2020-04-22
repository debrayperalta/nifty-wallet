import * as namehash from 'eth-ens-namehash';
import RnsJsDelegate from '../rnsjs-delegate';
import { keccak_256 as sha3 } from 'js-sha3';
import { DomainDetails } from '../classes'

/**
 * This is a delegate to manage all the RNS resolver operations.
 */
export default class RnsResolver extends RnsJsDelegate {
  buildApi () {
    const rnsJsApi = super.buildApi();
    return {
      getOwner: this.bindOperation(this.getOwner, this),
      isOwner: this.bindOperation(this.isOwner, this),
      getDomainDetails: this.bindOperation(this.getDomainDetails, this),
      ...rnsJsApi,
    }
  }

  /**
   * Get the owner of a domain.
   * @param domainName the domain name to check.
   * @returns {Promise<string>} owner address
   */
  getOwner (domainName) {
    return new Promise((resolve, reject) => {
      this.rnsContractInstance.owner(namehash.hash(domainName), (error, address) => {
          if (error) {
            reject(error);
          }
          console.debug('Owner Address', address);
          resolve(address);
      });
    });
  }

  /**
   * Checks if a domain is owned by an address.
   * @param domainName the domain name to check.
   * @param address the address to make the check.
   * @returns {Promise<boolean>} true if the address is the owner, false otherwise.
   */
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
  
  getDomainDetails(domainName, address) {
    return new Promise((resolve, reject) => {
      this.checkIfSubdomainAndGetExpirationRemaining(domainName).then(remainingDays => { 
        //Here i have the expiration in remainingDays
        this.getOwner(domainName)
        .then(ownerAddress => {
          //Here i have the owner address
          resolve(new DomainDetails('0x0', '0xabcd', remainingDays, false, ownerAddress));
        }).catch(error => reject(error));        
      }).catch(error => reject(error));
    });
  }

  checkIfSubdomainAndGetExpirationRemaining(domainName) {  
    return new Promise((resolve, reject) => {
      const label = domainName.split('.')[0];
      const hash = `0x${sha3(label)}`;
      this.rskOwnerContractInstance.expirationTime(hash, (error, result) => {
        if (error) {
          console.debug("Error when trying to invoke expirationTime", error);
          reject(error);
        }
        const expirationTime = result;
        this.web3.eth.getBlock('latest', (timeError, currentBlock) => {
          if (timeError) {
            console.debug("Time error when tryng to get last block ", timeError);
            reject(timeError);
          }
          const diff = expirationTime - currentBlock.timestamp;
          // the difference is in seconds, so it is divided by the amount of seconds per day
          const remainingDays = Math.floor(diff / (60 * 60 * 24));
          console.debug("Remaining time of domain", remainingDays);
          resolve(remainingDays);
        });
      });
    });
  };
}
