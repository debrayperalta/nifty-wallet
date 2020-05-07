// Constant names, if you want to add a new token (icon), just go to constant.js and add one to the array, then add it to getNameTokenForIcon
import { SLIP_ADDRESSES } from '../constants/slipAddresses'

var getChainAddressByChainAddress = function(chainAddress) {
    return SLIP_ADDRESSES.find(e => e.chain === chainAddress);
}

export {
  getChainAddressByChainAddress,
}
