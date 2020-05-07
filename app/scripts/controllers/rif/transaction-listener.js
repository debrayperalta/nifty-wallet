import EventEmitter from 'safe-event-emitter'
import {global} from './constants'

/**
 * Listener for pending mining transactions to handle events
 */
export class TransactionListener extends EventEmitter {
  constructor (props) {
    super();
    this.web3 = props.web3;
    this.transactionId = props.transactionId;
    this.transactionHash = props.transactionHash;
    this.transactionController = props.transactionController;
    this.transactionMined = false;
  }

  /**
   * Start listening for mined transactions to filter by our transaction if it's available
   * If the transaction is there we get the receipt and we emit events depending on what the result is.
   * @returns {TransactionListener}
   */
  listen () {
    this.transactionController.on(`tx:status-update`, (txId, status) => {
      if (this.transactionId === txId) {
        this.transactionMined = true;
        if (status === 'confirmed' || status === 'failed') {
          this.getTransactionReceipt().then(transactionReceipt => {
            if (transactionReceipt &&
              (transactionReceipt.status === true || transactionReceipt.status === global.TRANSACTION_STATUS_OK)) {
              this.emit('transactionSuccess', transactionReceipt);
            } else {
              this.emit('transactionFailed', transactionReceipt);
            }
          });
        }
      }
    });
    return this;
  }

  /**
   * Gets the transaction receipt if it's available at the time.
   * @returns {Promise<TransactionReceipt>}
   */
  getTransactionReceipt () {
    if (this.transactionMined) {
      return new Promise((resolve, reject) => {
        this.web3.eth.getTransactionReceipt(this.transactionHash, (error, transactionReceipt) => {
          if (error) {
            reject(error);
          }
          resolve(transactionReceipt);
        });
      });
    }
    return Promise.reject('The transaction is not mined yet');
  }

  /**
   * It returns a promise that resolves when the transaction is successfully mined and the status is 0x1, otherwise it rejects.
   * In both cases it retrieves the transaction receipt
   * @returns {Promise<TransactionReceipt>}
   */
  mined () {
    return new Promise((resolve, reject) => {
      this.on('transactionSuccess', (transactionReceipt) => {
        resolve(transactionReceipt);
      });
      this.on('transactionFailed', (transactionReceipt) => {
        reject(transactionReceipt);
      });
    });
  }
}
