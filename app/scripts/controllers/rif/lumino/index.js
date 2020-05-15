import {LocalStorageHandler, Lumino} from '@rsksmart/lumino-light-client-sdk';
import {lumino} from '../../../../../rif.config';
import extend from 'xtend';
import ObservableStore from 'obs-store';
import {LuminoSigningHandler} from './signing-handler';
import {AbstractManager} from '../abstract-manager';
import {isRskNetwork} from '../utils/general';

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
      await this.lumino.get().actions.onboardingClient();
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

}
