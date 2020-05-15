import {global} from '../constants';

export function isRskNetwork (networkId) {
  return global.networks.main === networkId ||
    global.networks.test === networkId ||
    global.networks.reg === networkId;
}
