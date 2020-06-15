import extend from 'xtend';
import ObservableStore from 'obs-store';
import {bindOperation} from '../utils/general';

export class RifConfigurationProvider {

  constructor (props) {
    this.networkController = props.networkController;
    const initState = extend({
      rifConfiguration: this.getInitialConfigStructure(this.networkController.getNetworkState()),
    }, props.initState);
    this.store = new ObservableStore(initState);
  }

  /**
   * This loads the default configuration on the store if it's not there already. If the configuration
   * it's there we validate that all the values are there and are not empty strings.
   * @param chainId the chainId used to load the configuration
   * @returns {boolean} true if the configuration was loaded and it's a valid configuration, false otherwise
   */
  loadConfiguration (chainId) {
    const actualState = this.store.getState();
    if (!actualState.rifConfiguration) {
      actualState.rifConfiguration = this.getInitialConfigStructure(chainId);
      this.store.setState(actualState);
      return true;
    } else {
      const configuration = actualState.rifConfiguration;
      return this.validateConfiguration(configuration);
    }
  }

  /**
   * Validates that the configuration is correct and every required value it's there.
   * @param configuration
   * @returns {boolean}
   */
  validateConfiguration (configuration) {
    return !!(configuration &&
      configuration.lumino &&
      configuration.lumino.hub &&
      configuration.lumino.hub.endpoint &&
      configuration.lumino.explorer &&
      configuration.lumino.explorer.endpoint &&
      configuration.notifier &&
      configuration.notifier.availableNodes &&
      configuration.notifier.availableNodes.length >= 3 &&
      configuration.rns &&
      configuration.rns.contracts &&
      configuration.rns.contracts.rns &&
      configuration.rns.contracts.publicResolver &&
      configuration.rns.contracts.multiChainResolver &&
      configuration.rns.contracts.rif &&
      configuration.rns.contracts.fifsAddrRegistrar &&
      configuration.rns.contracts.rskOwner);
  }

  /**
   * Get's the default configuration by chainId for RSK
   * @param chainId to use to get the configuration
   * @returns the configuration object
   */
  getInitialConfigStructure (chainId) {
    switch (chainId) {
      case 30: // RSK Mainnet
        return {
          lumino: {
            hub: {
              endpoint: '',
            },
            explorer: {
              endpoint: '',
            },
          },
          notifier: {
            availableNodes: [],
          },
          rns: {
            contracts: {
              rns: '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5',
              publicResolver: '0x4efd25e3d348f8f25a14fb7655fba6f72edfe93a',
              multiChainResolver: '0x99a12be4C89CbF6CFD11d1F2c029904a7B644368',
              rif: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
              fifsAddrRegistrar: '0xd9c79ced86ecf49f5e4a973594634c83197c35ab',
              rskOwner: '0x45d3e4fb311982a06ba52359d44cb4f5980e0ef1',
            },
          },
          mocksEnabled: false,
        };
      case 31: // RSK Testnet
        return {
          lumino: {
            hub: {
              endpoint: '',
            },
            explorer: {
              endpoint: '',
            },
          },
          notifier: {
            availableNodes: [],
          },
          rns: {
            contracts: {
              rns: '0x7d284aaac6e925aad802a53c0c69efe3764597b8',
              publicResolver: '0x1e7ae43e3503efb886104ace36051ea72b301cdf',
              multiChainResolver: '0x404308f2a2eec2cdc3cb53d7d295af11c903414e',
              rif: '0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE',
              fifsAddrRegistrar: '0x90734bd6bf96250a7b262e2bc34284b0d47c1e8d',
              rskOwner: '0xca0a477e19bac7e0e172ccfd2e3c28a7200bdb71',
            },
          },
          mocksEnabled: false,
        };
      case 33: // RSK Regtest
        return {
          lumino: {
            hub: {
              endpoint: '',
            },
            explorer: {
              endpoint: '',
            },
          },
          notifier: {
            availableNodes: [],
          },
          rns: {
            contracts: {
              rns: '',
              publicResolver: '',
              multiChainResolver: '',
              rif: '',
              fifsAddrRegistrar: '',
              rskOwner: '',
            },
          },
          mocksEnabled: false,
        };
    }
  }

  /**
   * Exposes the get configuration object method to be used on the ui or outside the manager
   * @returns a Promise with the configuration object.
   */
  getConfiguration () {
    return Promise.resolve(this.getConfigurationObject());
  }

  /**
   * Exposes the set configuration object method to be used outside the manager
   * @param configuration to be set.
   * @returns Promise that resolves if the configuration is set successfully or rejects otherwise.
   */
  setConfiguration (configuration) {
    try {
      this.setConfigurationObject(configuration);
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve();
  }

  getConfigurationObject () {
    return this.store.getState().rifConfiguration;
  }

  setConfigurationObject (configuration) {
    const actualState = this.store.getState();
    if (this.validateConfiguration(configuration)) {
      actualState.rifconfiguration = configuration;
      this.store.setState(actualState);
    } else {
      throw new Error('Invalid configuration provided');
    }
  }

  /**
   * Method to be overwritten by a child class to control the event when we change the address.
   * @param network the new network.
   */
  onNetworkChanged (network) {
    this.network = network;
    this.loadConfiguration(network.id)
  }

  /**
   * This operation is executed when the user unlocks the wallet
   */
  onUnlock () {
    this.loadConfiguration(this.networkController.getNetworkState());
  }

  bindApi () {
    return {
      getConfiguration: bindOperation(this.getConfiguration, this),
      setConfiguration: bindOperation(this.setConfiguration, this),
    };
  }


}
