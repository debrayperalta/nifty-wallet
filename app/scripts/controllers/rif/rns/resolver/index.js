import * as namehash from 'eth-ens-namehash';
import RnsJsDelegate from '../rnsjs-delegate';
import web3Utils from 'web3-utils';
import { DomainDetails, ResolverNetwork } from '../classes';
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
      setResolver: this.bindOperation(this.setResolver, this),
      getNetworksForResolvers: this.bindOperation(this.getNetworksForResolvers, this),
      setNetoworksForResolver: this.bindOperation(this.setNetoworksForResolver, this),
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
   * @param domainName
   * @returns {Promise<unknown>}
   */
  getDomainDetails (domainName) {
    const domainNameResolver = domainName + '.rsk';
    return new Promise((resolve, reject) => {
      const getDomainAddress = this.getDomainAddress(domainNameResolver);
      const content = this.getContent(domainNameResolver);
      const expiration = this.getExpirationRemaining(domainNameResolver);
      const getOwner = this.getOwner(domainNameResolver);
      const getResolver = this.getResolver(domainNameResolver);
      Promise.all([getDomainAddress, content, expiration, getOwner, getResolver]).then(values => {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + values[2]);
        let status = this.getStatus(values[2]);
        resolve(new DomainDetails(domainNameResolver, values[0], values[1], getDateFormatted(expirationDate), false, values[3], status, values[4], false, false));
      }).catch(error => {
        reject(error);
      });
    });
  }

  /**
   * Gets a resolver address if the domain has one
   * @param domainNameResolver with the .rsk extension
   * @returns {Promise<unknown>}
   */
  getResolver(domainNameResolver) {
    return new Promise((resolve, reject) => {
      this.call(this.rnsContractInstance, 'resolver', [namehash.hash(domainNameResolver)]).then(result => {
        /* TODO: Rodrigo
        * 0x0000000000000000000000000000000000000000 this is what it brings when no resolver is setted
        */
        console.debug('getResolver resolved with', result);
        resolve(web3Utils.toChecksumAddress(result));
      }).catch(error => {
        console.debug('Error when trying to get resolver addr', error);
        reject(error);
      });
    });
  }

  /**
   * Calls the contract and sets a new resolver to a given DomainName (This function is only_owner)
   * @param domainNameResolver DomainName with the .rsk extension
   * @param resolverAddress Address of the new resolver to be setted
   * @returns {Promise<unknown>}
   */
  setResolver(domainNameResolver, resolverAddress) {
    return new Promise((resolve, reject) => {
      this.send(this.rnsContractInstance, 'setResolver', [namehash.hash(domainNameResolver), resolverAddress])
        .then(result => {
        console.debug('setResolver success', result);
        resolve(result);
      }).catch(error => {
        console.debug('Error when trying to set resolver', error);
        reject(error);
      });
    });
  }

  /**
   * Returns an array of network addresses for a given domain
   * @param domainNameResolver DomainName with the .rsk extension
   * @returns {Promise<unknown>}
   */
  getNetworksForResolvers (domainNameResolver) {
    return new Promise((resolve, reject) => {
      // TODO: Rodrigo
      // This event is different, it deppends if we're on the chain of RSK, or not, to develop purposes i'll use only ChainAddrChanged, it need to differentiate it from one to another
      const myEvent = this.multiChainresolverContractInstance.ChainAddrChanged({node: namehash.hash(domainNameResolver)}, {fromBlock: 0, toBlock: 'latest'});
      myEvent.get(function(error, result){
        if (error) {
          console.debug('Error when trying to get netoworks for resolver', error);
          reject(error);
        }
        const arrChains = [];
        result.forEach(network => {
          const networkToPush = new ResolverNetwork(network.args.chain, network.args.addr)
          const index = arrChains.findIndex((e) => e.chain === networkToPush.chain);
          if (index === -1) {
            arrChains.push(networkToPush);
          } else {
            arrChains[index] = networkToPush;
          }
        });
        console.debug('getNetworksForResolvers success', arrChains);
        resolve(arrChains);
      });
    });
  }

  /**
   * Calls the contract and sets a new network calling the setChainAddr function in the contract of multichainresolver
   * @param domainNameResolver domainNameResolver DomainName with the .rsk extension
   * @param chain
   * @param networkAddress
   * @returns {Promise<unknown>}
   */
  setNetoworksForResolver (domainNameResolver, chain, networkAddress) {
    return new Promise((resolve, reject) => {
      this.send(this.multiChainresolverContractInstance, 'setChainAddr', [namehash.hash(domainNameResolver), chain, networkAddress])
        .then(result => {
          console.debug('setNetoworksForResolver success', result);
          resolve(result);
        }).catch(error => {
        console.debug('Error when trying to set netoworks for resolver', error);
        reject(error);
      });
    });
  }

  /**
  * Returns a status for the days remaining of a domain
  * @param {int} daysRemaining
  */
  getStatus(daysRemaining) {
   let retStatus = DOMAIN_STATUSES.ACTIVE
   if (daysRemaining <= 0) {
     retStatus = DOMAIN_STATUSES.EXPIRED;
   } else if (daysRemaining > 0 && daysRemaining <= EXPIRING_REMAINING_DAYS) {
     retStatus = DOMAIN_STATUSES.EXPIRING;
   }
    return retStatus;
  }

  /**
   * Gets the expiration time in days of a given domain name
   * @param domainName the domain name to check (without resolver).
   * @returns {Promise<boolean>} Days remaining (int), an error otherwise
   */
  getExpirationRemaining (domainName) {
    return new Promise((resolve, reject) => {
      const label = this.cleanDomainFromRskPrefix(domainName);
      const hash = `0x${web3Utils.sha3(label)}`;
      this.call(this.rskOwnerContractInstance, 'expirationTime', [hash]).then(result => {
        const expirationTime = result;
        this.web3.eth.getBlock('latest', (timeError, currentBlock) => {
          if (timeError) {
            console.debug('Time error when tryng to get last block ', timeError);
            reject(timeError);
          }
          const diff = expirationTime - currentBlock.timestamp;
          // the difference is in seconds, so it is divided by the amount of seconds per day
          const remainingDays = Math.floor(diff / (60 * 60 * 24));
          console.debug('Remaining time of domain', remainingDays);
          resolve(remainingDays);
        });
      }).catch(error => {
        console.debug('Error when trying to invoke expirationTime', error);
        reject(error);
      });
    });
  };

  getContent (domainName) {
    return new Promise((resolve, reject) => {
      const label = domainName.split('.')[0];
      this.call(this.multiChainresolverContractInstance, 'content', [label]).then(result => {
        resolve(result);
      }).catch(error => {
        console.debug('Error when trying to get content of domain', error);
        reject(error);
      });
    });
  }
}
