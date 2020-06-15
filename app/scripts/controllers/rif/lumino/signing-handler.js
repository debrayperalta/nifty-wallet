import ethUtils from 'ethereumjs-util';
import Transaction from 'ethereumjs-tx';
import web3Utils from 'web3-utils';
import {Wallet} from 'ethers';
/**
 * Custom signing handler for lumino client using our sign controller.
 */
export class LuminoSigningHandler {
  constructor (props) {
    this.address = web3Utils.toChecksumAddress(props.address);
    this.keyringController = props.keyringController;
    this.transactionController = props.transactionController;
  }

  async initialize () {
    const privateKey = await this.keyringController.exportAccount(this.address);
    this.wallet = new Wallet(privateKey);
  }

  async updateAddress (newAddress) {
    this.address = web3Utils.toChecksumAddress(newAddress);
    await this.initialize();
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

  async offChainSign (plainOrByteMessage) {
    return await this.wallet.signMessage(plainOrByteMessage);
  }
}
