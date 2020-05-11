import rifConfig from './../../../../rif.config';
import { DEFAULT_ICON, domainIconProps, luminoNodeIconProps, rifStorageIconProps} from './icons';

export const registrationTimeouts = {
  // number of seconds to wait before updating the page for the clock waiting.
  registering: 4,
  // number of seconds to wait before showing the confirmation message, this is to wait for the confirmation operation.
  registerConfirmation: 6,
}

export function GET_RESOLVERS () {
  return ([{
    name: 'Multi-Chain',
    address: rifConfig.rns.contracts.multiChainResolver,
  }]);
}


export {
  DEFAULT_ICON,
  domainIconProps,
  luminoNodeIconProps,
  rifStorageIconProps,
}
