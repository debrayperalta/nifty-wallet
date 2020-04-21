import RnsDelegate from './rns-delegate'
import RNS from '@rsksmart/rns'
import rifConfig from './../../../../../rif.config';

/**
 * This class encapsulates all the RNSJS logic, it initializes rnsjs library and uses it as a wrapper.
 */
export default class RnsJsDelegate extends RnsDelegate {
  constructor (props) {
    super(props);
    this.rnsJs = new RNS(this.web3, this.getRNSOptions());
  }

  buildApi () {
    return {
      getDomainAddress: this.bindOperation(this.getDomainAddress, this),
      getAddressDomain: this.bindOperation(this.getAddressDomain, this),
      setAddressToDomain: this.bindOperation(this.setAddressToDomain, this),
      setDomainResolver: this.bindOperation(this.setDomainResolver, this),
      isDomainAvailable: this.bindOperation(this.isDomainAvailable, this),
      isSubdomainAvailable: this.bindOperation(this.isSubdomainAvailable, this),
      setSubdomainOwner: this.bindOperation(this.setSubdomainOwner, this),
      createSubdomain: this.bindOperation(this.createSubdomain, this),
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
    return this.rnsJs.setAddr(domainName, address);
  }

  /**
   * Set resolver of a given domain.
   * @param domainName Domain to set resolver.
   * @param resolver Address to be set as the resolver of the given domain
   * @returns {Promise<>} TransactionReceipt
   */
  setDomainResolver (domainName, resolver) {
    return this.rnsJs.setResolver(domainName, resolver);
  }

  /**
   * Check if given domain is available or if there is any availability for the given label.
   * @param domainName Domain or label to check availability.
   * @returns {Promise<boolean | string[]>} true if the domain is available, false if not,
   * or an array of available domains under possible TLDs if the parameter is a label
   */
  isDomainAvailable (domainName) {
    return this.rnsJs.available(domainName);
  }

  /**
   * Checks if the given label subdomain is available under the given domain tree.
   * @param domainName Parent .rsk domain. For example, wallet.rsk
   * @param subdomain Subdomain whose availability should be checked. For example, alice
   * @returns {Promise<boolean>} true if available, false if not
   */
  isSubdomainAvailable (domainName, subdomain) {
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
    return this.rnsJs.subdomains.setOwner(domainName, subdomain, ownerAddress);
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
    return this.rnsJs.subdomains.create(domainName, subdomain, ownerAddress, parentOwnerAddress);
  }

  /**
   * Updates the store state
   * @param newState
   */
  updateStoreState (newState) {
    this.store.putState(newState);
  }

  /**
   * Gets the store state
   * @returns the current state
   */
  getStoreState () {
    return this.store.getState();
  }

}
