export class LuminoStorageHandler {
  constructor (props) {
    this.store = props.store;
  }
  getLuminoData () {
    const unparsedData = this.store.getState().luminoData;
    if (unparsedData) {
      return JSON.parse(unparsedData);
    }
    return null;
  }
  saveLuminoData (data) {
    if (data) {
      const state = this.store.getState();
      state.luminoData = JSON.stringify(data);
      this.store.putState(state);
    }
  }
}
