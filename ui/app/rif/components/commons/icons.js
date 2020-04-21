import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { domainIconProps, luminoNodeIconProps, rifStorageIconProps} from '../../constants'

const DomainIcon = ({ className }) => <FontAwesomeIcon icon={domainIconProps.icon} color={domainIconProps.color} className={className ? className : 'default-icon'}/>
const LuminoNodeIcon = ({ className }) => <FontAwesomeIcon icon={luminoNodeIconProps.icon} color={luminoNodeIconProps.color} className={className ? className : 'default-icon'}/>
const RifStorageIcon = ({ className }) => <FontAwesomeIcon icon={rifStorageIconProps.icon} color={rifStorageIconProps.color} className={className ? className : 'default-icon'}/>


export {
    DomainIcon,
    LuminoNodeIcon,
    RifStorageIcon,
}