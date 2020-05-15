import ethUtils from 'ethereumjs-util';
/**
 * Custom signing handler for lumino client using our sign controller.
 */
export class LuminoSigningHandler {
  constructor (props) {
    this.address = props.address;
    this.keyringController = props.keyringController;
  }

  sign (tx) {
    const sign = this.keyringController.signTransaction(tx, this.address);
    sign.then(signedTransaction => {
      console.debug('Lumino Signed Transaction', signedTransaction);
    });
    return sign;
  }

  offChainSign (plainMessage) {
    const message = ethUtils.toBuffer(plainMessage);
    const messageHash = ethUtils.hashPersonalMessage(message);
    const offChainSign = this.keyringController.signMessage({
      from: this.address,
      data: messageHash,
    });
    offChainSign.then(signedMessage => {
      console.debug('Lumino Signed Message', signedMessage);
    });
    return offChainSign;
  }
}
