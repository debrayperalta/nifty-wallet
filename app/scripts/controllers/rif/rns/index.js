import RnsRegister from './register'
import RnsResolver from './resolver'
import RnsTransfer from './transfer'
import Web3 from 'web3'
import rifConfig from '/rif.config'
import RNS from './abis/RNS.json'

export const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'

export default class RnsManager {
  constructor (props) {

    if (!props.preferencesController) {
      throw new Error('PreferencesController has to be present')
    }

    if (!props.networkController) {
      throw new Error('NetworkController has to be present')
    }

    const preferencesController = this.props.preferencesController
    const networkController = this.props.networkController

    if (!props.web3) {
      this.web3 = new Web3(global.ethereumProvider)
    } else {
      this.web3 = props.web3
    }

    this.preferencesController = preferencesController
    this.networkController = networkController

    this.preferencesController.store.subscribe(this.preferencesUpdated)
    this.selectedAccount = this.preferencesController.store.getState().selectedAccount
    this.rifConfig = rifConfig
    this.rnsContractInstance = new this.web3.eth.Contract(RNS, this.rifConfig.rns.contracts.rns)

    this.rnsRegister = new RnsRegister({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      selectedAccount: this.selectedAccount,
    })
    this.rnsResolver = new RnsResolver({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      selectedAccount: this.selectedAccount,
    })
    this.rnsTransfer = new RnsTransfer({
      web3: this.web3,
      preferencesController,
      networkController,
      rifConfig,
      rnsContractInstance: this.rnsContractInstance,
      selectedAccount: this.selectedAccount,
    })
  }

  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    if (this.selectedAccount !== preferences.selectedAccount) {
      // update
      this.updateAccount(preferences.selectedAccount)
    }
  }

  updateAccount (selectedAccount) {
    this.selectedAccount = selectedAccount
    this.rnsRegister.selectedAccount = selectedAccount
    this.rnsResolver.selectedAccount = selectedAccount
    this.rnsTransfer.selectedAccount = selectedAccount
  }

  getApi () {
    return {
      ...this.rnsRegister.getApi(),
      ...this.rnsTransfer.getApi(),
      ...this.rnsResolver.getApi(),
    }
  }
}
