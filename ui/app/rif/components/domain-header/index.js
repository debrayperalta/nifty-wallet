import React, {Component} from 'react'
import {DomainIcon, LuminoNodeIcon, RifStorageIcon} from '../commons'
import PropTypes from 'prop-types'

class Index extends Component {

  static propTypes = {
    domainName: PropTypes.string,
    showOwnerIcon: PropTypes.bool,
    showLuminoNodeIcon: PropTypes.bool,
    showRifStorageIcon: PropTypes.bool,
  }

  render () {
    const {showOwnerIcon, showLuminoNodeIcon, showRifStorageIcon, domainName} = this.props;
    return (
      <div id="headerName" className="domain-name">
        <span>{domainName}</span>
        {showOwnerIcon &&
        <DomainIcon className="domain-icon"/>
        }
        {showLuminoNodeIcon &&
        <LuminoNodeIcon className="domain-icon"/>
        }
        {showRifStorageIcon &&
        <RifStorageIcon className="domain-icon"/>
        }
      </div>
    );
  }
}
module.exports = Index;
