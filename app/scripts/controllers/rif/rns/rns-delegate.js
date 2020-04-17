export default class RnsDelegate {
  constructor (props) {
    this.web3 = props.web3
    this.preferencesController = this.props.preferencesController
    this.networkController = this.props.networkController
    this.rifConfig = props.rifConfig
    this.rnsContractInstance = props.rnsContractInstance
    this.selectedAccount = props.selectedAccount
    this.initialize()
  }
  initialize () {}
}
