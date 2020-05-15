/**
 * Abstract manager to encapsulate the logic to catch preferences updates and other stuff shared by managers.
 */
export class AbstractManager {
  constructor (props) {
    this.web3 = props.web3;
    this.transactionController = props.transactionController;
    this.preferencesController = props.preferencesController;
    this.networkController = props.networkController;
    this.unlocked = false;
  }

  /**
   * Method to be overwritten by a child class to control the event when we change the address.
   * @param network the new network.
   */
  onNetworkChanged (network) {
    this.network = network;
  }

  /**
   * Method to be overwritten by a child class to control the event when we change the address.
   * @param address the new address.
   */
  onAddressChanged (address) {
    this.address = address;
  }

  /**
   * This operation is executed when the user unlocks the wallet
   */
  onUnlock () {
    this.unlocked = true;
  }
}
