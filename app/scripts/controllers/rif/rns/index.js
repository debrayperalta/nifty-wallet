import RnsRegister from './register'
import RnsResolver from './resolver'
import RnsTransfer from './transfer'
import Web3 from 'web3'

export default class RnsManager {
  constructor (props) {

    if (!props.preferenceStore) {
      throw new Error('PreferencesStore has to be present')
    }

    if (!props.web3Instance) {
      this.web3 = new Web3(global.ethereumProvider)
    } else {
      this.web3 = props.web3Instance
    }

    this.props.preferenceStore.subscribe(this.onPreferencesUpdated)
    this.selectedAccount = this.props.preferenceStore.getState().selectedAccount

    this.rnsRegister = new RnsRegister()
    this.rnsResolver = new RnsResolver()
    this.rnsTransfer = new RnsTransfer()
  }

  preferencesUpdated (preferences) {
    // check if the account was changed and update the rns domains to show
    if (this.selectedAccount !== preferences.selectedAccount) {
      // update
    }
  }
}
