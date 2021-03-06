import RnsRegister from './register'
import RnsResolver from './resolver'
import RnsTransfer from './transfer'
import rifConfig from './../../../../../rif.config'
import RNS from './abis/RNS.json'
import RIF from './abis/RIF.json'
import extend from 'xtend'
import ObservableStore from 'obs-store'
import {RnsContainer} from './container';

/**
 * This class encapsulates all the RNS operations, it initializes and call to all the delegates and exposes their operations.
 *
 * Props:
 *   preferenceController and networkController: this is passed only to have more access on the delegates to the config.
 *   web3: a web3 instance to make the contract calls.
 */
export default class RnsManager {
  constructor (props) {
    const preferencesController = props.preferencesController;
    const networkController = props.networkController;
    const transactionController = props.transactionController;

    this.web3 = props.web3;

    this.preferencesController = preferencesController;
    this.networkController = networkController;
    this.transactionController = transactionController;

    this.preferencesController.store.subscribe(updatedPreferences => this.preferencesUpdated(updatedPreferences));
    this.address = this.preferencesController.store.getState().selectedAddress;
    this.rifConfig = rifConfig;
    this.rnsContractInstance = this.web3.eth.contract(RNS).at(this.rifConfig.rns.contracts.rns);
    this.rifContractInstance = this.web3.eth.contract(RIF).at(this.rifConfig.rns.contracts.rif);
    const initState = extend({
      register: {},
      resolver: {},
      transfer: {},
    }, props.initState);
    this.store = new ObservableStore(initState);

    const register = new RnsRegister({
      web3: this.web3,
      preferencesController,
      networkController,
      transactionController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      rifContractInstance: this.rifContractInstance,
      address: this.address,
      store: this.store,
    });
    const resolver = new RnsResolver({
      web3: this.web3,
      preferencesController,
      networkController,
      transactionController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      rifContractInstance: this.rifContractInstance,
      address: this.address,
      store: this.store,
    });
    const transfer = new RnsTransfer({
      web3: this.web3,
      preferencesController,
      networkController,
      transactionController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      rifContractInstance: this.rifContractInstance,
      address: this.address,
      store: this.store,
    });
    this.container = new RnsContainer({
      register,
      resolver,
      transfer,
    });
  }

  /**
   * When the preferences are updated and the account has changed this operation is called to update the selected
   * address.
   * @param preferences the updated preferences.
   */
  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    if (this.address !== preferences.selectedAddress) {
      // update
      this.updateAccount(preferences.selectedAddress);
    }
  }

  /**
   * This updates all the addresses used by the manager and it's delegates.
   * @param address the new address.
   */
  updateAccount (address) {
    this.address = address;
    this.container.register.address = address;
    this.container.resolver.address = address;
    this.container.transfer.address = address;
  }

  /**
   * It binds all the operations to be accessed from the outside.
   * @returns an object like { operationName: function bind}
   */
  bindApi () {
    return {
      register: this.container.register.buildApi(),
      resolver: this.container.resolver.buildApi(),
      transfer: this.container.transfer.buildApi(),
    }
  }
}
