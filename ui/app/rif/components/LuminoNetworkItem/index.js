import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class LuminoNetworkItem extends Component {

  static propTypes = {
    icon: PropTypes.object,
    name: PropTypes.string.isRequired,
    nodes: PropTypes.number.isRequired,
    channels: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.object,
  }

  render = () => {
    const {icon, name, nodes, channels, onClick, className = {}} = this.props;
    return (<div onClick={onClick}>
      {icon && <div>
        <FontAwesomeIcon icon={icon} className={className.icon}/>
      </div>
      }
      <div>
        <span>{name}</span>
      </div>
      <div>
        <img height={15} width={15} src="images/rif/node.svg"/>
        <span>{nodes} nodes
      </span>
      </div>
      <div>
        <img height={15} width={15} src="images/rif/node.svg"/>
        <span>{channels} channels</span>
      </div>
      <div>
        <img height={15} width={15} src="images/rif/chevronRight.svg"/>
      </div>
    </div>);
  }
}

export default LuminoNetworkItem;
