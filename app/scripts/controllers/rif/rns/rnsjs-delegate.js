import RnsDelegate from './rns-delegate'
import RNS from '@rsksmart/rns'
import rifConfig from './../../../../../rif.config';
import {rns} from '../constants'

/**
 * This class encapsulates all the RNSJS logic, it initializes rnsjs library and uses it as a wrapper.
 */
export default class RnsJsDelegate extends RnsDelegate {
  constructor (props) {
    super(props);
    this.rnsJs = new RNS(this.web3, this.getRNSOptions());
  }

  buildApi () {
    const api = super.buildApi();
    return {
      ...api,
      getDomainAddress: this.bindOperation(this.getDomainAddress, this),
      getAddressDomain: this.bindOperation(this.getAddressDomain, this),
      setAddressToDomain: this.bindOperation(this.setAddressToDomain, this),
      setDomainResolver: this.bindOperation(this.setDomainResolver, this),
      isDomainAvailable: this.bindOperation(this.isDomainAvailable, this),
      isSubdomainAvailable: this.bindOperation(this.isSubdomainAvailable, this),
      setSubdomainOwner: this.bindOperation(this.setSubdomainOwner, this),
      createSubdomain: this.bindOperation(this.createSubdomain, this),
      getSubdomainsForDomain: this.bindOperation(this.getSubdomainsForDomain, this),
    }
  }

  /**
   * Gets the options for the RNS object needed to use rnsjs library
   * @returns an object like {{networkId: (() => number) | number, contractAddresses: {registry: string}}}
   */
  getRNSOptions () {
    return {
      networkId: this.networkController.store.getState().networkId,
      contractAddresses: {
        registry: rifConfig.rns.contracts.rns,
      },
    };
  }

  /**
   * Get the address of a given domain and chain. If chainId is not provided, it resolves current blockchain address.
   * @param domainName Domain to be resolved.
   * @param chainId Chain identifier listed in https://github.com/satoshilabs/slips/blob/master/slip-0044.md
   * @returns {Promise<string>} the address resolution
   */
  getDomainAddress (domainName, chainId) {
    domainName = this.addRskSuffix(domainName);
    return this.rnsJs.addr(domainName, chainId);
  }

  /**
   * Reverse lookup: Get the name of a given address.
   * @param address Address to be resolved.
   * @returns {Promise<string>} Domain or subdomain associated to the given address.
   */
  getAddressDomain (address) {
    return this.rnsJs.reverse(address);
  }

  /**
   * Set address resolution of a given domain using the AbstractAddrResolver interface.
   * @param domainName Domain to set resolution.
   * @param address Address to be set as the resolution of the given domain
   * @returns {Promise<>} TransactionReceipt
   */
  setAddressToDomain (domainName, address) {
    domainName = this.addRskSuffix(domainName);
    return this.rnsJs.setAddr(domainName, address);
  }

  /**
   * Set resolver of a given domain.
   * @param domainName Domain to set resolver.
   * @param resolver Address to be set as the resolver of the given domain
   * @returns {Promise<>} TransactionReceipt
   */
  setDomainResolver (domainName, resolver) {
    domainName = this.addRskSuffix(domainName);
    return this.rnsJs.setResolver(domainName, resolver);
  }

  /**
   * Check if given domain is available or if there is any availability for the given label.
   * @param domainName Domain or label to check availability.
   * @returns {Promise<boolean | string[]>} true if the domain is available, false if not,
   * or an array of available domains under possible TLDs if the parameter is a label
   */
  isDomainAvailable (domainName) {
    domainName = this.addRskSuffix(domainName);
    return this.rnsJs.available(domainName);
  }

  /**
   * Checks if the given label subdomain is available under the given domain tree.
   * @param domainName Parent .rsk domain. For example, wallet.rsk
   * @param subdomain Subdomain whose availability should be checked. For example, alice
   * @returns {Promise<boolean>} true if available, false if not
   */
  isSubdomainAvailable (domainName, subdomain) {
    domainName = this.addRskSuffix(domainName);
    return this.rnsJs.subdomains.available(domainName, subdomain);
  }

  /**
   * Creates a new subdomain under the given domain tree if it is available.
   * Precondition: the sender should be the owner of the parent domain.
   * @param domainName Parent .rsk domain. For example, wallet.rsk
   * @param subdomain Subdomain to register. For example, alice
   * @param ownerAddress The new owner’s address
   * @returns {Promise<>}
   */
  setSubdomainOwner (domainName, subdomain, ownerAddress) {
    domainName = this.addRskSuffix(domainName);
    const result = this.rnsJs.subdomains.setOwner(domainName, subdomain, ownerAddress);
    result.then(transactionReceipt => {
      if (transactionReceipt) {
        const subdomains = this.getSubdomains(domainName);
        const foundSubdomain = subdomains.find(sd => sd.name === subdomain);
        foundSubdomain.ownerAddress = ownerAddress;
        this.updateSubdomains(domainName, subdomains);
      }
    })
    return result;
  }

  /**
   * Creates a new subdomain under the given domain tree if it is available, and sets its resolution if addr is provided.
   * @param domainName Parent .rsk domain. For example, wallet.rsk
   * @param subdomain Subdomain to register. For example, alice
   * @param ownerAddress The owner of the new subdomain. If not provided, the address who executes the tx will be the owner
   * @param parentOwnerAddress The address to be set as resolution of the new subdomain
   *
   * If addr is not provided, no resolution will be set
   * If owner is not provided, the sender will be set as the new owner
   * If owner and addr are provided and owner is equals to the sender, two txs will be sent.
   * If owner and addr are provided but owner is different from the sender, then three txs will be sent.
   *
   * @returns {Promise<>} TransactionReceipt of the latest transaction
   */
  createSubdomain (domainName, subdomain, ownerAddress, parentOwnerAddress) {
    domainName = this.addRskSuffix(domainName);
    if (!ownerAddress && !parentOwnerAddress) {
      return Promise.reject('You need to specify ownerAddress or parentOwnerAddress');
    } else if (!ownerAddress) {
      ownerAddress = parentOwnerAddress;
    }
    const result = this.rnsJs.subdomains.create(domainName, subdomain, ownerAddress, parentOwnerAddress);
    result.then(transactionReceipt => {
      if (transactionReceipt) {
        const subdomains = this.getSubdomains(domainName);
        subdomains.push({
          domainName,
          name: subdomain,
          ownerAddress,
          parentOwnerAddress,
        });
        this.updateSubdomains(domainName, subdomains);
      }
    }).catch(error => {
      console.log(error);
    });
    return result;
  }

  /**
   * Gets the subdomains under a domain name
   * @param domainName the domain name to query
   * @returns the subdomains array
   */
  getSubdomains (domainName) {
    domainName = this.addRskSuffix(domainName);
    const state = this.getStateForContainer(rns.storeContainers.register);
    if (!state || !state.domains || !state.domains[domainName] || !state.domains[domainName].subdomains) {
      return [];
    }
    return state.domains[domainName].subdomains;
  }

  /**
   * Method to get the subdomains under a domain name, exposes the getSubdomains method
   * @param domainName the domain name to query
   * @returns the subdomains under the domain name
   */
  getSubdomainsForDomain (domainName) {
    domainName = this.addRskSuffix(domainName);
    return Promise.resolve(this.getSubdomains(domainName));
  }

  /**
   * Updates the subdomains under a domain name
   * @param domainName the domain to update
   * @param subdomains the subdomains under the domain name
   */
  updateSubdomains (domainName, subdomains) {
    domainName = this.addRskSuffix(domainName);
    let state = this.getStateForContainer(rns.storeContainers.register);
    if (!state) {
      state = {
        domains: [],
      };
    }
    if (!state.domains) {
      state.domains = {};
    }
    if (!state.domains[domainName]) {
      state.domains[domainName] = {
        subdomains: [],
      };
    }
    if (!state.domains[domainName].subdomains) {
      state.domains[domainName].subdomains = [];
    }
    state.domains[domainName].subdomains = subdomains;
    this.updateStateForContainer(rns.storeContainers.register, state);
  }


}
