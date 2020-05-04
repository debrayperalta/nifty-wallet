import * as namehash from 'eth-ens-namehash';
import RnsJsDelegate from '../rnsjs-delegate';
import web3Utils from 'web3-utils';
import { DomainDetails } from '../classes';
import RSKOwner from '../abis/RSKOwner.json';
import MultiChainresolver from '../abis/MultiChainResolver.json';
import { DOMAIN_STATUSES, EXPIRING_REMAINING_DAYS } from '../../constants';
import { getDateFormatted } from '../../utils/dateUtils';

/**
 * This is a delegate to manage all the RNS resolver operations.
 */
export default class RnsResolver extends RnsJsDelegate {
  initialize () {
    this.rskOwnerContractInstance = this.web3.eth.contract(RSKOwner).at(this.rifConfig.rns.contracts.rskOwner);
    this.multiChainresolverContractInstance = this.web3.eth.contract(MultiChainresolver).at(this.rifConfig.rns.contracts.multiChainResolver);
  }

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
          resolve(web3Utils.toChecksumAddress(address));
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
  
  /**
   * Gets all details of a given domain name
   * @param domainName the domain name to check (without resolver).
   * @returns {Promise<boolean>} true if it can get all the details correctly, false otherwise.
   */  
  getDomainDetails(domainName) {
    const domainNameResolver = domainName + ".rsk";
    return new Promise((resolve, reject) => {
      const getDomainAddress = this.getDomainAddress(domainNameResolver);
      const content = this.getContent(domainNameResolver);
      const expiration = this.getExpirationRemaining(domainNameResolver);
      const getOwner = this.getOwner(domainNameResolver);
      Promise.all([getDomainAddress, content, expiration, getOwner]).then(values => { 
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + values[2]);
        let status = this.getStatus(values[2]);
        resolve(new DomainDetails(domainNameResolver, values[0], values[1], getDateFormatted(expirationDate), false, values[3], status, false, false));
      }).catch(error => {
        reject(error);
      });
    });
  }

 /**
  * Returns a status for the days remaining of a domain
  * @param {int} daysRemaining 
  */
  getStatus(daysRemaining){
    let retStatus = DOMAIN_STATUSES.ACTIVE
    if(daysRemaining <= 0)
      retStatus = DOMAIN_STATUSES.EXPIRED;
    else if(daysRemaining > 0 && daysRemaining <= EXPIRING_REMAINING_DAYS)
      retStatus = DOMAIN_STATUSES.EXPIRING;
    return retStatus;
  }

  /**
   * Gets the expiration time in days of a given domain name
   * @param domainName the domain name to check (without resolver).
   * @returns {Promise<boolean>} Days remaining (int), an error otherwise
   */
  getExpirationRemaining(domainName) {  
    return new Promise((resolve, reject) => {
      const label = this.cleanDomainFromRskPrefix(domainName);
      const hash = `0x${web3Utils.sha3(label)}`;
      this.call(this.rskOwnerContractInstance, 'expirationTime', [hash]).then(result => {
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
      }).catch(error => {
        console.debug("Error when trying to invoke expirationTime", error);
        reject(error);
      });
    });
  };

  getContent(domainName) {  
    return new Promise((resolve, reject) => {
      const label = domainName.split('.')[0];
      this.call(this.multiChainresolverContractInstance, 'content', [label]).then(result => {
        resolve(result);
      }).catch(error => {
        console.debug("Error when trying to get content of domain", error);
        reject(error);
      });
    });
  };
}
