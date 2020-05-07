import { faCoins, faCheckCircle, faBolt, faArchive } from '@fortawesome/free-solid-svg-icons'

export const DEFAULT_ICON = {
  color: '#000080',
  icon: faCoins,
}

export const domainIconProps = {
    color: '#000080',
    icon: faCheckCircle,
}

export const luminoNodeIconProps = {
    color: '#508871',
    icon: faBolt,
}

export const rifStorageIconProps = {
    color: '#AD3232',
    icon: faArchive,
}

export const registrationTimeouts = {
  // number of seconds to wait before updating the page for the clock waiting.
  registering: 4,
  // number of seconds to wait before showing the confirmation message, this is to wait for the confirmation operation.
  registerConfirmation: 6,
}
/** TODO: Rodrigo
 * Both of this consts need to be moved to a config file, or something better than this solution
 * @type {string[]}
 */
const RESOLVERS_MAINNET = [
  {
    name: 'Multicrypto',
    address: '0xfE87342112c26fbF2Ae30031FE84860793b495B9',
  },
]
const RESOLVERS_TEST = [
  {
    name: 'Multi-Chain',
    address: '0xfE87342112c26fbF2Ae30031FE84860793b495B9',
  },
]

export function GET_RESOLVERS (env) {
  if (env === 'dev') {
    return RESOLVERS_TEST;
  } else {
    return RESOLVERS_MAINNET;
  }
}
