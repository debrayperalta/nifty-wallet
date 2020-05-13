/**
 * Abstract manager to encapsulate the logic to catch preferences updates and other stuff shared by managers.
 */
export class AbstractManager {
  constructor (props) {
    this.preferencesController = props.preferencesController;
    this.address = this.preferencesController.store.getState().selectedAddress;
    this.preferencesController.store.subscribe(updatedPreferences => this.preferencesUpdated(updatedPreferences));
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
      this.updateAddress(preferences.selectedAddress);
    }
  }

  /**
   * Updates the current address and calls a method that can be overwritten to manage that change.
   * @param address
   */
  updateAddress (address) {
    this.address = address;
    this.onChangedAddress(address);
  }

  /**
   * Method to be overwritten by a child class to control the event when we change the address.
   * @param address the new address.
   */
  onChangedAddress (address) {}
}
