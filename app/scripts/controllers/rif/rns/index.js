import RnsRegister from './register';
import RnsResolver from './resolver';
import RnsTransfer from './transfer';
import rifConfig from './../../../../../rif.config';
import RNS from './abis/RNS.json';
import ObservableStore from 'obs-store';

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

    this.web3 = props.web3;

    this.preferencesController = preferencesController;
    this.networkController = networkController;

    this.preferencesController.store.subscribe(this.preferencesUpdated);
    this.address = this.preferencesController.store.getState().selectedAccount;
    this.rifConfig = rifConfig;
    this.rnsContractInstance = this.web3.eth.contract(RNS).at(this.rifConfig.rns.contracts.rns);
    this.store = new ObservableStore({
      register: {},
      resolver: {},
      transfer: {},
    });

    this.rnsRegister = new RnsRegister({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      address: this.address,
      store: this.store,
    });
    this.rnsResolver = new RnsResolver({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      address: this.address,
      store: this.store,
    });
    this.rnsTransfer = new RnsTransfer({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      address: this.address,
      store: this.store,
    });
  }

  /**
   * When the preferences are updated and the account has changed this operation is called to update the selected
   * address.
   * @param preferences the updated preferences.
   */
  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    if (this.address !== preferences.selectedAccount) {
      // update
      this.updateAccount(preferences.selectedAccount);
    }
  }

  /**
   * This updates all the addresses used by the manager and it's delegates.
   * @param address the new address.
   */
  updateAccount (address) {
    this.address = address;
    this.rnsRegister.address = address;
    this.rnsResolver.address = address;
    this.rnsTransfer.address = address;
  }

  /**
   * It binds all the operations to be accessed from the outside.
   * @returns an object like { operationName: function bind}
   */
  bindApi () {
    return {
      register: this.rnsRegister.buildApi(),
      resolver: this.rnsResolver.buildApi(),
      transfer: this.rnsTransfer.buildApi(),
    }
  }
}
