// Constant names, if you want to add a new token (icon), just go to constant.js and add one to the array, then add it to getNameTokenForIcon
import { SLIP_NETWORK } from '../constants/slipNetworks'

var getNetworkByNetworkAddress = function(networkAddress) {
    return SLIP_NETWORK.find(network => network.chain === networkAddress);
}

export {
  getNetworkByNetworkAddress,
}
