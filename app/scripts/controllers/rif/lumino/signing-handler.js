import ethUtils from 'ethereumjs-util';
import Transaction from 'ethereumjs-tx';
/**
 * Custom signing handler for lumino client using our sign controller.
 */
export class LuminoSigningHandler {
  constructor (props) {
    this.address = props.address;
    this.keyringController = props.keyringController;
    this.transactionController = props.transactionController;
  }

  async sign (rawTx) {
    const chainId = this.transactionController.getChainId()
    const txParams = Object.assign({}, rawTx, { chainId });
    // sign tx
    const ethTx = new Transaction(txParams);
    await this.transactionController.signEthTx(ethTx, this.address);
    const signedTransaction = ethUtils.bufferToHex(ethTx.serialize());
    console.debug('Signed raw transaction', signedTransaction)
    return signedTransaction
  }

  async offChainSign (plainMessage) {
    try {
      const message = ethUtils.toBuffer(plainMessage);
      const messageHash = ethUtils.hashPersonalMessage(message);
      const offChainSign = await this.keyringController.signMessage({
        from: this.address,
        data: messageHash,
      });
      console.debug('Lumino Signed Message', offChainSign);
      return offChainSign;
    } catch (error) {
      console.error(error);
    }
  }
}
