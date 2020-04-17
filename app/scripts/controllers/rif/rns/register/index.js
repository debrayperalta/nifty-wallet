import FIFSRegistrar from '../abis/FIFSRegistrar.json'

export default class RnsRegister {
  constructor (props) {
    this.web3 = props.web3
    this.preferencesController = this.props.preferencesController
    this.networkController = this.props.networkController
    this.rifConfig = props.rifConfig
    this.rnsContractInstance = props.rnsContractInstance
    this.initialize()
  }

  initialize () {
    this.fifsContractInstance = new this.web3.eth.Contract(FIFSRegistrar, this.rifConfig.rns.contracts.fifsRegistrar)
  }
}
