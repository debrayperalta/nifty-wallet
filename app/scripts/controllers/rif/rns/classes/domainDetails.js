export default class DomainDetails {
    constructor(address, content, expiration, autoRenew, owner) {
        this.address = address;
        this.content = content;
        this.expiration = expiration;
        this.autoRenew = autoRenew;
        this.owner = owner;
    }
}