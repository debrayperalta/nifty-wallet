/**
 * Custom signing handler for lumino client using our sign controller.
 */
export class LuminoSignHandler {
  constructor (props) {
    this.address = props.address;
    this.keyringController = props.keyringController;
  }

  sign (tx) {
    return this.keyringController.signTransaction(tx, this.address);
  }

  offChainSign (byteMessage) {
    return this.keyringController.signMessage({
      from: this.address,
      data: byteMessage,
    });
  }
}
