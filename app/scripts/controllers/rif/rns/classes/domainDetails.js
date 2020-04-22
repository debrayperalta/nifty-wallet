/**
 * This class is used to retrieve data from the contracts 
 * @attribute domainName: Domain address with resolver (Ex: jhondoe.rsk)
 * @attribute address: Address of domain in hex checksummed (Ex: 0x1234567912345)
 * @attribute content: Content of domain
 * @attribute expiration: Expiration time in days (Number, ex: 365)
 * @attribute autoRenew: Boolean, if the domain has the autoRenew option setted
 * @attribute owner: Address of the domain owner checksummed (Ex: 0x1234567912345)
 */
/**Dev comment
 * Use proptypes to validate this values, or some solution so it will always be the same format
 */
export default class DomainDetails {
    constructor(domainName, address, content, expiration, autoRenew, owner) {
        this.domainName = domainName;
        this.address = address;
        this.content = content;
        this.expiration = expiration;
        this.autoRenew = autoRenew;
        this.owner = owner;
    }
}