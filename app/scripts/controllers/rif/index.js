import RnsManager from './rns'
import Web3 from 'web3'
import ComposableObservableStore from './../../lib/ComposableObservableStore'
import {LuminoManager} from './lumino';
import {bindOperation} from './utils/general';

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
    if (!props.metamaskController) {
      throw new Error('MetamaskController has to be present');
    }
    this.metamaskController = props.metamaskController;
    this.web3 = new Web3(this.metamaskController.networkController._provider);

    const initState = props.initState || {};

    this.rnsManager = new RnsManager({
      initState: initState.RnsManager,
      preferencesController: this.metamaskController.preferencesController,
      networkController: this.metamaskController.networkController,
      transactionController: this.metamaskController.txController,
      web3: this.web3,
    });

    this.luminoManager = new LuminoManager({
      initState: initState.LuminoManager,
      web3: this.web3,
      keyringController: this.metamaskController.keyringController,
      preferencesController: this.metamaskController.preferencesController,
      networkController: this.metamaskController.networkController,
      transactionController: this.metamaskController.txController,
    });

    this.store = new ComposableObservableStore(props.initState, {
      RnsManager: this.rnsManager.store,
      LuminoManager: this.luminoManager.store,
    });

    this.metamaskController.preferencesController.store.subscribe(updatedPreferences => this.preferencesUpdated(updatedPreferences));
    this.metamaskController.networkController.store.subscribe(updatedNetwork => this.networkUpdated(updatedNetwork));
    this.metamaskController.on('update', (memState) => {
      const unlocked = this.metamaskController.isUnlocked();
      if (unlocked && !this.alreadyUnlocked) {
        this.alreadyUnlocked = true;
        this.unlocked();
      }
    });
  }

  /**
   * When the preferences are updated and the account has changed this operation is called to update the selected
   * address.
   * @param preferences the updated preferences.
   */
  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    const newAddress = preferences.selectedAddress;
    if (this.address !== newAddress) {
      // update
      this.address = newAddress;
      this.onAddressChanged(this.address);
    }
  }

  /**
   * This operation is called when the user changes the network
   * @param networkState the new network state: {
                                                  provider: {
                                                    nickname: ""
                                                    rpcTarget: ""
                                                    ticker: ""
                                                    type: ""
                                                  }
                                                  network: ""
                                                  settings: {
                                                    network: ""
                                                    chainId: ""
                                                    rpcUrl: ""
                                                    ticker: ""
                                                    nickname: ""
                                                  }
                                                }
   */
  networkUpdated (networkState) {
    this.network = {
      id: networkState.network,
      rskEndpoint: networkState.provider.rpcTarget,
    };
    this.onNetworkChanged(this.network);
  }

  /**
   * Event executed when the user unlocks the wallet
   */
  unlocked () {
    this.rnsManager.onUnlock();
    this.luminoManager.onUnlock();
  }

  /**
   * Event executed when the user changes the selected network
   * @param network the new network state
   */
  onNetworkChanged (network) {
    this.rnsManager.onNetworkChanged(network);
    this.luminoManager.onNetworkChanged(network);
  }

  /**
   * Event executed when the user changes the selected address
   * @param address the new address
   */
  onAddressChanged (address) {
    this.rnsManager.onAddressChanged(address);
    this.luminoManager.onAddressChanged(address);
  }

  /**
   * Cleans the store completely, this can be used by the developer to reset rif state.
   */
  cleanStore () {
    this.rnsManager.store.putState({});
    this.luminoManager.store.putState({});
    return Promise.resolve();
  }

  /**
   * This method publishes all the operations available to call from the ui for RifController
   * and all it's members.
   * @returns an object like { operationName: functionBind, }
   */
  exposeApi () {
    return {
      rns: this.rnsManager.bindApi(),
      lumino: this.luminoManager.bindApi(),
      cleanStore: bindOperation(this.cleanStore, this),
    }
  }
}
