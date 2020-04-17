export default class RnsDelegate {
  constructor (props) {
    this.web3 = props.web3;
    this.preferencesController = props.preferencesController;
    this.networkController = props.networkController;
    this.rifConfig = props.rifConfig;
    this.rnsContractInstance = props.rnsContractInstance;
    this.selectedAccount = props.selectedAccount;
    this.store = props.store;
    this.initialize();
  }

  initialize () {}

  getApi () {}
}
