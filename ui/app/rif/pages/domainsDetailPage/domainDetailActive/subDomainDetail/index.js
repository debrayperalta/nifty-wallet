import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ChainAddresses, LuminoChannels} from '../../../../components';
import TransferTable from '../../../../components/transferTable';

class SubDomainDetail extends Component {

  static propTypes = {
    domainName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }

  render = () => {
    const {domainName, name} = this.props;
    const mockAddress = '0x123456789012345'
    const subDomainFullName = `${name}.${domainName}`
    return <div>
      <h3>{subDomainFullName}</h3>
      <div>
        <ChainAddresses domainName={subDomainFullName}/>
      </div>
      <div>
        <TransferTable controllerAddress={mockAddress}/>
      </div>
      <div>
        <LuminoChannels/>
      </div>
    </div>
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

export default connect(mapStateToProps, null)(SubDomainDetail);
