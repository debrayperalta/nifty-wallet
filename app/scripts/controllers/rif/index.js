import RnsManager from './rns'
import Web3 from 'web3'

export default class RifController {
  constructor (props) {
    if (!props.preferencesController) {
      throw new Error('PreferencesController has to be present');
    }

    if (!props.networkController) {
      throw new Error('NetworkController has to be present');
    }

    if (!props.metamaskStore) {
      throw new Error('MetaMask store has to be present');
    }

    if (!props.memoryStore) {
      throw new Error('Memory Store has to be present');
    }

    this.metamaskStore = props.metamaskStore;
    this.memoryStore = props.memoryStore;
    this.preferencesController = props.preferencesController;
    this.networkController = props.networkController;
    this.web3 = new Web3(this.networkController._provider);

    this.rnsManager = new RnsManager({
      preferencesController: this.preferencesController,
      networkController: this.networkController,
      web3: this.web3,
    });

    const metamaskStoreConfig = {
      ...this.metamaskStore.config,
      RnsManager: this.rnsManager.store,
    };
    const memoryStoreConfig = {
      ...this.memoryStore.config,
      RnsManager: this.rnsManager.store,
    };
    this.metamaskStore.updateStructure(metamaskStoreConfig);
    this.memoryStore.updateStructure(memoryStoreConfig);
  }

  getApi () {
    return {
      rns: this.rnsManager.getApi(),
    }
  }
}
