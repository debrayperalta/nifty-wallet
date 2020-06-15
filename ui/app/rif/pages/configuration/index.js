import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import rifActions from '../../actions';
import niftyActions from '../../../actions';

class RifConfiguration extends Component {

  static propTypes = {
    updateConfiguration: PropTypes.func,
    getConfiguration: PropTypes.func,
    goToSettings: PropTypes.func,
    showToast: PropTypes.func,
  }

  constructor (props) {
    super(props);
    this.state = {
      configuration: null,
      loading: true,
      notifierNode: null,
    };
    this.props.getConfiguration()
      .then(configuration => {
        this.setState({
          configuration,
          loading: false,
        });
      });
  }

  updateLuminoHubConfiguration (event) {
    const luminoHubEndpoint = event.target.value;
    if (luminoHubEndpoint) {
      const configuration = this.state.configuration;
      configuration.lumino.hub.endpoint = luminoHubEndpoint;
      this.setState({
        configuration,
      });
    }
  }

  updateExplorerConfiguration (event) {
    const explorerEndpoint = event.target.value;
    if (explorerEndpoint) {
      const configuration = this.state.configuration;
      configuration.lumino.explorer.endpoint = explorerEndpoint;
      this.setState({
        configuration,
      });
    }
  }

  updateNotifierNodeToAdd (event) {
    const endpoint = event.target.value;
    this.setState({
      notifierNode: endpoint,
    });
  }

  saveNotifierNode () {
    const configuration = this.state.configuration;
    configuration.notifier.availableNodes.push(this.state.notifierNode);
    this.setState({
      configuration,
      notifierNode: null,
    });
  }

  getNotifierInputs () {
    const configuration = this.state.configuration;
    const notifierInputs = [];
    configuration.notifier.availableNodes.forEach((availableNode, index) => {
      notifierInputs.push(<li className="form-segment">
                            <input onChange={(event) => this.updateNotifierNode(event, index)} value={availableNode} placeholder="Notifier Endpoint" />
                            <span onClick={() => this.deleteNotifierNode(index)}><i className="fa fa-times"/></span>
                          </li>);
    });
    if (this.state.notifierNode) {
      notifierInputs.push(<li className="form-segment">
                            <input onChange={(event) => this.updateNotifierNodeToAdd(event)} placeholder="Notifier Endpoint" />
                            <span onClick={() => this.saveNotifierNode()}><i className="fa fa-check"/></span>
                          </li>);
    }
    return notifierInputs;
  }

  addNotifierInput () {
    this.setState({
      notifierNode: true,
    });
  }

  updateContractAddress (contractKey, event) {
    const address = event.target.value;
    const configuration = this.state.configuration;
    if (address && configuration) {
      configuration.rns.contracts[contractKey] = address;
      this.setState({
        configuration,
      });
    }
  }

  updateNotifierNode (event, index) {
    const configuration = this.state.configuration;
    const endpoint = event.target.value;
    if (endpoint && index && configuration) {
      configuration.notifier.availableNodes.push(endpoint);
      this.setState({
        configuration,
      });
    }
  }

  deleteNotifierNode (index) {
    const configuration = this.state.configuration;
    if (index !== undefined && configuration) {
      delete configuration.notifier.availableNodes[index];
      this.setState({
        configuration,
      });
    }
  }

  saveConfiguration () {
    const configuration = this.state.configuration;
    this.props.updateConfiguration(configuration)
      .then(done => {
        this.props.goToSettings();
      }).catch(error => {
        this.props.showToast('Error trying to update configuration: ' + error.message, false);
    });
  }

  render () {
    if (this.state.loading) {
      return (<div>Loaing Configuration...</div>);
    }
    const notifierInputs = this.getNotifierInputs();
    return (
      <div>
        <div className="form-segment">
          <input value={this.state.configuration.lumino.hub.endpoint} onChange={(event) => this.updateLuminoHubConfiguration(event)} placeholder="Lumino Hub Endpoint" />
        </div>
        <div className="form-segment">
          <input value={this.state.configuration.lumino.explorer.endpoint} onChange={(event) => this.updateExplorerConfiguration(event)} placeholder="Explorer Endpoint" />
        </div>
        <div className="form-segment">
          <span>Notifier</span>
          <button className="btn-primary" onClick={() => this.addNotifierInput()}>Add</button>
          <ul>
            {notifierInputs}
          </ul>
        </div>
        <div className="form-segment">
          <span>Rns</span>
          <ul>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.rns} onChange={(event) => this.updateContractAddress('rns', event)} placeholder="RNS Contract Address" />
            </li>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.publicResolver} onChange={(event) => this.updateContractAddress('publicResolver', event)} placeholder="Public Resolver Contract Address" />
            </li>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.multiChainResolver} onChange={(event) => this.updateContractAddress('multiChainResolver', event)} placeholder="MultiChain Contract Address" />
            </li>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.rif} onChange={(event) => this.updateContractAddress('rif', event)} placeholder="RIF Contract Address" />
            </li>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.fifsAddrRegistrar} onChange={(event) => this.updateContractAddress('fifsAddrRegistrar', event)} placeholder="FIFSAddress Registrar Contract Address" />
            </li>
            <li className="form-segment">
              <input value={this.state.configuration.rns.contracts.rskOwner} onChange={(event) => this.updateContractAddress('rskOwner', event)} placeholder="RSK Owner" />
            </li>
          </ul>
        </div>
        <div className="form-segment">
          <button className="btn-primary" onClick={() => this.saveConfiguration()}>Save Configuration</button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getConfiguration: () => dispatch(rifActions.getConfiguration()),
    updateConfiguration: (configuration) => dispatch(rifActions.setConfiguration(configuration)),
    goToSettings: () => dispatch(niftyActions.showConfigPage(false)),
    showToast: (message, success) => dispatch(niftyActions.displayToast(message, success)),
  }
}
module.exports = connect(null, mapDispatchToProps)(RifConfiguration)
