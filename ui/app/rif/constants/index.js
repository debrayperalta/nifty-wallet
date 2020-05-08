import { faCoins, faCheckCircle, faBolt, faArchive } from '@fortawesome/free-solid-svg-icons';
import rifConfig from './../../../../rif.config';

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

export function GET_RESOLVERS () {
  return ({
    name: 'Multi-Chain',
    address: rifConfig.rns.contracts.multiChainResolver,
  });
}
