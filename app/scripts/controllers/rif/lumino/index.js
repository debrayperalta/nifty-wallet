import {LocalStorageHandler, Lumino} from '@rsksmart/lumino-light-client-sdk';
import {lumino} from '../../../../../rif.config';
import extend from 'xtend';
import ObservableStore from 'obs-store';
import {LuminoSignHandler} from './sign-handler';
import {AbstractManager} from '../abstract-manager';

/**
 * Manager to control the access to lumino api
 */
export class LuminoManager extends AbstractManager {

  constructor (props) {
    super(props);
    this.web3 = props.web3;
    this.lumino = Lumino;

    const initState = extend({}, props.initState);
    this.store = new ObservableStore(initState);

    const configParams = {
      chainId: this.web3.eth.net.getId(),
      rskEndpoint: this.web3.currentProvider,
      hubEndpoint: lumino.hub.endpoint,
      Address: this.address,
      notifierEndPoint: lumino.notifier.endpoint,
    };

    this.signingHandler = new LuminoSignHandler({
      address: this.address,
      keyringController: props.keyringController,
    });

    this.lumino.init(this.signingHandler, LocalStorageHandler, configParams);

    this.initialize();
  }

  initialize () {
    this.lumino.get().actions.onboardingClient();
  };

  onChangedAddress (address) {
    this.signingHandler.address = address;
  }

}
