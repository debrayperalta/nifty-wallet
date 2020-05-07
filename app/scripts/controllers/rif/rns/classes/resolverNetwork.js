// Slip-0044 https://github.com/satoshilabs/slips/blob/master/slip-0044.md
/**
 * This class is used to retrieve networks from logs
 * @attribute chain: hexa code of the chain, given in slip-0044
 * @attribute address: Address of the network
 */
/**
 * Dev comment
 * Use proptypes to validate this values, or some solution so it will always be the same format
 */
export default class ResolverNetwork {
  constructor(chain, address) {
    this.chain = chain;
    this.address = address;
  }
}
