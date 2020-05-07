/**
 * This class is used to retrieve data from the contracts
 * @attribute domain: Domain address with resolver (Ex: jhondoe.rsk)
 * @attribute address: Address of domain in hex checksummed (Ex: 0x1234567912345)
 * @attribute content: Content of domain
 * @attribute expiration: Expiration date (Date, ex: 01/01/2020)
 * @attribute autoRenew: Boolean, if the domain has the autoRenew option setted
 * @attribute ownerAddress: Address of the domain owner checksummed (Ex: 0x1234567912345)
 * @attribute status: Status of the domain (ENUM: {'active', 'pending', 'expired', 'expiring'})
 * @attribute selectedResolverAddress: Resolver selected address
 * @attribute isLuminoNode: If the domain has a lumino node asociated
 * @attribute isRifStorage: If the domain has a rif storage asociated
 */
export default class DomainDetails {
    constructor(domain, address, content, expiration, autoRenew, ownerAddress, status, selectedResolverAddress, isLuminoNode, isRifStorage) {
        this.domain = domain;
        this.address = address;
        this.content = content;
        this.expiration = expiration;
        this.autoRenew = autoRenew;
        this.ownerAddress = ownerAddress;
        this.status = status;
        this.isLuminoNode = isLuminoNode;
        this.isRifStorage = isRifStorage;
        this.selectedResolverAddress = selectedResolverAddress;
    }
}
