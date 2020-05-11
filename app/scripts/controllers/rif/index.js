import RnsManager from './rns'
import Web3 from 'web3'
import ComposableObservableStore from './../../lib/ComposableObservableStore'

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

    this.preferencesController = props.preferencesController;
    this.networkController = props.networkController;
    this.transactionController = props.transactionController;
    this.web3 = new Web3(this.networkController._provider);

    const initState = props.initState || {};

    this.rnsManager = new RnsManager({
      initState: initState.RnsManager,
      preferencesController: this.preferencesController,
      networkController: this.networkController,
      transactionController: this.transactionController,
      web3: this.web3,
    });

    this.store = new ComposableObservableStore(props.initState, {
      RnsManager: this.rnsManager.store,
    });
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
