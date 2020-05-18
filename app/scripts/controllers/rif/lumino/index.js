import {LocalStorageHandler, Lumino} from '@rsksmart/lumino-light-client-sdk';
import {lumino} from '../../../../../rif.config';
import extend from 'xtend';
import ObservableStore from 'obs-store';
import {LuminoSigningHandler} from './signing-handler';
import {AbstractManager} from '../abstract-manager';
import {bindOperation, isRskNetwork} from '../utils/general';
import {LuminoOperations} from './operations';
import {LuminoCallbacks} from './callbacks';

/**
 * Manager to control the access to lumino api
 */
export class LuminoManager extends AbstractManager {

  constructor (props) {
    super(props);
    this.lumino = Lumino;
    this.keyringController = props.keyringController;
    const initState = extend({}, props.initState);
    this.store = new ObservableStore(initState);
    this.signingHandler = new LuminoSigningHandler({
      address: this.address,
      keyringController: this.keyringController,
    });
  }

  async initializeLumino () {
    if (this.unlocked && isRskNetwork(this.network.id)) {
      const configParams = {
        chainId: this.network.id,
        rskEndpoint: this.network.rskEndpoint,
        hubEndpoint: lumino.hub.endpoint,
        address: this.address,
      };
      const signingHandler = {
        sign: (tx) => this.signingHandler.sign(tx),
        offChainSign: (byteMessage) => this.signingHandler.offChainSign(byteMessage),
      }
      await this.lumino.init(signingHandler, LocalStorageHandler, configParams);
      this.operations = new LuminoOperations(this.lumino);
      this.callbacks = new LuminoCallbacks(this.lumino);
      await this.operations.onboarding();
    }
  };

  onUnlock () {
    super.onUnlock();
    this.initializeLumino();
  }

  onNetworkChanged (network) {
    super.onNetworkChanged(network);
    this.initializeLumino();
  }

  onAddressChanged (address) {
    super.onAddressChanged(address);
    this.signingHandler.address = address;
  }

  bindApi () {
    return {
      onboarding: bindOperation(this.operations.onboarding, this.operations),
      openChannel: bindOperation(this.operations.openChannel, this.operations),
      closeChannel: bindOperation(this.operations.closeChannel, this.operations),
      createDeposit: bindOperation(this.operations.createDeposit, this.operations),
      createPayment: bindOperation(this.operations.createPayment, this.operations),
      getChannels: bindOperation(this.operations.getChannels, this.operations),
      getAvailableCallbacks: bindOperation(this.callbacks.getAvailableCallbacks, this.callbacks),
      listenCallback: bindOperation(this.callbacks.listenForCallback, this.callbacks),
    };
  }

}
