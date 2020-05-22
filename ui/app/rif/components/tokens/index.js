import React from 'react';
import {DEFAULT_ICON, PATH_TO_RIF_IMAGES, JOINED_TEXT, UNJOINED_TEXT} from '../../constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {brandConnections} from '../../constants/icons';

const Logo = (className, icon) => <div className={className ? className.tokenLogo : 'token-logo align-left'}>
    {icon ?
      <img src={PATH_TO_RIF_IMAGES + icon.icon} className={className ? className.tokenLogoPng : 'token-logo-png'}/>
      :
      <FontAwesomeIcon icon={DEFAULT_ICON.icon} color={DEFAULT_ICON.color} className={className ? className.tokenLogoIcon : 'token-logo-icon'}/>
    }
  </div>

const Channels = (className, channelsLength) => <div>
  <div className={'token-info-channels align-right'}>
    <div className={'token-info-channels-icon align-left'}>
      <FontAwesomeIcon icon={brandConnections.icon} color={brandConnections.color} />
    </div>
    <div className={'token-info-channels-channels align-right'}>{channelsLength}</div>
  </div>
</div>

const JoinedChip = (className, joined) =>
  <div className={'token-info-status align-right ' + (joined ? 'token-info-status-joined' : 'token-info-status-unjoined')}>
    {joined ? JOINED_TEXT : UNJOINED_TEXT}
  </div>

export {
  Logo,
  Channels,
  JoinedChip,
}
