import rifConfig from './../../../../rif.config';
import { DEFAULT_ICON, domainIconProps, luminoNodeIconProps, rifStorageIconProps, tokenIcons, SVG_PLUS} from './icons';

export const registrationTimeouts = {
  // number of seconds to wait before updating the page for the clock waiting.
  secondsToCheckForCommitment: 4,
}

export function GET_RESOLVERS () {
  return ([{
    name: 'Multi-Chain',
    address: rifConfig.rns.contracts.multiChainResolver,
  }]);
}
const PATH_TO_RIF_IMAGES = '/images/rif/';

export {
  DEFAULT_ICON,
  domainIconProps,
  luminoNodeIconProps,
  rifStorageIconProps,
  tokenIcons,
  PATH_TO_RIF_IMAGES,
  SVG_PLUS,
}
