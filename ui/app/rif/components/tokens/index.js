import React from 'react';
import {DEFAULT_ICON, PATH_TO_RIF_IMAGES, JOINED_TEXT, UNJOINED_TEXT} from '../../constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {brandConnections} from '../../constants/icons';

const Logo = (className, icon) => {
  return (<div className={(className && className.tokenLogo) ? className.tokenLogo : ''}>
    {icon && icon.icon ?
      <img src={PATH_TO_RIF_IMAGES + icon.icon}
           className={(className && className.tokenLogoPng) ? className.tokenLogoPng : ''}/>
      :
      <FontAwesomeIcon icon={DEFAULT_ICON.icon} color={DEFAULT_ICON.color}
                       className={(className && className.tokenLogoIcon) ? className.tokenLogoIcon : ''}/>
    }
  </div>);
}

const Channels = (className, channelsLength) => {
  return (<div>
    <div className={(className && className.tokenInfoChannels) ? className.tokenInfoChannels : ''}>
      <div className={(className && className.tokenInfoChannelsIcon) ? className.tokenInfoChannelsIcon : ''}>
        <FontAwesomeIcon icon={brandConnections.icon} color={brandConnections.color} />
      </div>
      <div className={(className && className.tokenInfoChannelsQty) ? className.tokenInfoChannelsQty : ''}>{channelsLength}</div>
    </div>
  </div>);
}

const JoinedChip = (className, joined) => {
  return (<div className={
    ((className && className.tokenInfoStatus) ? className.tokenInfoStatus : '') +
      (joined ? ((className && className.tokenInfoStatusJoined) ? className.tokenInfoStatusJoined : '') :
        ((className && className.tokenInfoStatusUnJoined) ? className.tokenInfoStatusUnJoined : ''))}>
    {joined ? JOINED_TEXT : UNJOINED_TEXT}
  </div>);
}

export {
  Logo,
  Channels,
  JoinedChip,
}
