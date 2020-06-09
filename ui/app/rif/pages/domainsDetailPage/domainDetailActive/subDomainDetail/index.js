import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ChainAddresses, LuminoChannels} from '../../../../components';
import TransferTable from '../../../../components/transferTable';
import rifActions from '../../../../actions';

class SubDomainDetail extends Component {

  static propTypes = {
    domainName: PropTypes.string.isRequired,
    getSubdomains: PropTypes.func,
    name: PropTypes.string.isRequired,
  }

  constructor (props) {
    super(props);
    const {name, domainName} = props;
    this.state = {
      subDomainFullName: `${name}.${domainName}`,
      controllerAddress: '',
    }
  }

  componentDidMount = async () => {
    const {getSubdomains, domainName, name} = this.props
    const allSubdomains = await getSubdomains(domainName);
    const subdomain = allSubdomains.find(s => s.name === name);
    if (subdomain) this.setState({controllerAddress: subdomain.ownerAddress})
  }

  render = () => {
    const {subDomainFullName, controllerAddress} = this.state;
    return <div>
      <h3>{subDomainFullName}</h3>
      <div>
        <ChainAddresses domainName={subDomainFullName}/>
      </div>
      {controllerAddress && <div>
        <TransferTable controllerAddress={controllerAddress}/>
      </div>
      }
      <div>
        <LuminoChannels/>
      </div>
    </div>
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getSubdomains: (domainName) => dispatch(rifActions.getSubdomains(domainName)),
  }
}

function mapStateToProps (state) {
  const params = state.appState.currentView.params;
  return {
    ...params,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubDomainDetail);
