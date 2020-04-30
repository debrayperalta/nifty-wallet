import RnsManager from './rns';
import Web3 from 'web3';

/**
 * RIF Controller
 *
 * This controller hold's all the business logic for RIF
 * Any operation related to RIF like rns contracts should be here.
 *
 * Props:
 *   preferenceController: the preference controller that has all the preferences of the user
 *   networkController: this is needed to create a new instance of web3 and get all the network info
 *   metamaskStore and memoryStore: this 2 stores holds all the stores on the app, this is to register the RIF store into the application stores.
 *
 */
export default class RifController {
  constructor (props) {
    if (!props.preferencesController) {
      throw new Error('PreferencesController has to be present');
    }

    if (!props.networkController) {
      throw new Error('NetworkController has to be present');
    }

    if (!props.transactionController) {
      throw new Error('TransactionController has to be present');
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
    this.transactionController = props.transactionController;
    this.web3 = new Web3(this.networkController._provider);

    this.rnsManager = new RnsManager({
      preferencesController: this.preferencesController,
      networkController: this.networkController,
      transactionController: this.transactionController,
      web3: this.web3,
    });

    const metamaskStoreConfig = {
      ...this.metamaskStore.config,
      RifController: this.rnsManager.store,
    };
    const memoryStoreConfig = {
      ...this.memoryStore.config,
      RnsManager: this.rnsManager.store,
    };
    this.metamaskStore.updateStructure(metamaskStoreConfig);
    this.memoryStore.updateStructure(memoryStoreConfig);
  }

  /**
   * This method publishes all the operations available to call from the ui for RifController
   * and all it's members.
   * @returns an object like { operationName: functionBind, }
   */
  exposeApi () {
    return {
      rns: this.rnsManager.bindApi(),
    }
  }
}
