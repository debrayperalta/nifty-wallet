import RnsManager from './rns'

export default class RifController {
  constructor (props) {
    if (!props.preferencesController) {
      throw new Error('PreferencesController has to be present');
    }

    if (!props.networkController) {
      throw new Error('NetworkController has to be present');
    }

    if (!props.web3) {
      throw new Error('Web3 has to be present');
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
    this.web3 = props.web3;

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
      ...this.rnsManager.getApi(),
    }
  }
}
