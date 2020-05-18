import {global} from '../constants';

const nodeify = require('../../../lib/nodeify');

export function isRskNetwork (networkId) {
  return global.networks.main === networkId ||
    global.networks.test === networkId ||
    global.networks.reg === networkId;
}

/**
 * Makes the operation callback available
 * @param operation the function reference
 * @param member the function container
 * @returns {function(...[*]=)}
 */
export function bindOperation (operation, member) {
  return nodeify(operation, member);
}
