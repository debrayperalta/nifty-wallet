import RnsRegister from './register'
import RnsResolver from './resolver'
import RnsTransfer from './transfer'
import rifConfig from './../../../../../rif.config'
import RNS from './abis/RNS.json'
import ObservableStore from 'obs-store'

export const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'

export default class RnsManager {
  constructor (props) {
    const preferencesController = props.preferencesController;
    const networkController = props.networkController;

    this.web3 = props.web3;

    this.preferencesController = preferencesController;
    this.networkController = networkController;

    this.preferencesController.store.subscribe(this.preferencesUpdated);
    this.selectedAccount = this.preferencesController.store.getState().selectedAccount;
    this.rifConfig = rifConfig;
    this.rnsContractInstance = new this.web3.eth.contract(RNS, this.rifConfig.rns.contracts.rns);
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
      selectedAccount: this.selectedAccount,
      store: this.store,
    });
    this.rnsResolver = new RnsResolver({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      selectedAccount: this.selectedAccount,
      store: this.store,
    });
    this.rnsTransfer = new RnsTransfer({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      selectedAccount: this.selectedAccount,
      store: this.store,
    });
  }

  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    if (this.selectedAccount !== preferences.selectedAccount) {
      // update
      this.updateAccount(preferences.selectedAccount);
    }
  }

  updateAccount (selectedAccount) {
    this.selectedAccount = selectedAccount;
    this.rnsRegister.selectedAccount = selectedAccount;
    this.rnsResolver.selectedAccount = selectedAccount;
    this.rnsTransfer.selectedAccount = selectedAccount;
  }

  getApi () {
    return {
      ...this.rnsRegister.getApi(),
      ...this.rnsTransfer.getApi(),
      ...this.rnsResolver.getApi(),
    }
  }
}
