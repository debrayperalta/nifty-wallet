import {lumino} from '../../../../../rif.config';
import {LuminoSigningHandler} from './signing-handler';
import {AbstractManager} from '../abstract-manager';
import {bindOperation, isRskNetwork} from '../utils/general';
import {LuminoOperations} from './operations';
import {LuminoCallbacks} from './callbacks';
import ethUtils from 'ethereumjs-util';
import { LuminoExplorer } from './explorer';
import {LuminoStorageHandler} from './storage';
let sdk = require('@rsksmart/lumino-light-client-sdk');

/**
 * Manager to control the access to lumino api
 */
export class LuminoManager extends AbstractManager {

  constructor (props) {
    super(props, {
      apiKey: null,
    });
    this.lumino = sdk.Lumino;
    this.signingHandler = new LuminoSigningHandler({
      transactionController: this.transactionController,
      address: this.address,
      keyringController: this.keyringController,
    });
    this.luminoExplorer = new LuminoExplorer();
    this.operations = new LuminoOperations(this.lumino);
    this.callbacks = new LuminoCallbacks(this.lumino);
    this.keyringController = props.keyringController;
  }

  async initializeLumino (cleanApiKey = false) {
    if (this.unlocked && isRskNetwork(this.network.id)) {
      const configParams = {
        chainId: this.network.id,
        rskEndpoint: this.network.rskEndpoint,
        hubEndpoint: lumino.hub.endpoint,
        address: ethUtils.toChecksumAddress(this.address),
      };
      const signingHandler = {
        sign: (tx) => this.signingHandler.sign(tx),
        offChainSign: (byteMessage) => this.signingHandler.offChainSign(byteMessage),
      }
      const luminoStorageHandler = new LuminoStorageHandler({
        store: this.store,
      });
      const storageHandler = {
        getLuminoData: () => {
          return luminoStorageHandler.getLuminoData();
        },
        saveLuminoData: (data) => {
          luminoStorageHandler.saveLuminoData(data);
        },
      };
      await this.lumino.init(signingHandler, storageHandler, configParams);
      const state = this.store.getState();
      try {
        if (state.apiKey && !cleanApiKey) {
          await this.operations.setApiKey(state.apiKey);
          try {
            await this.operations.onboarding();
          } catch (onboardingError) {
            console.debug('Error trying to intialize SDK: ', onboardingError);
            if (onboardingError.response &&
                  onboardingError.response.data &&
                    onboardingError.response.data.errors &&
            onboardingError.response.data.errors === 'There is no light client associated with the api key provided.') {
              // we need to refresh the api key with a new one
              await this.destroyLumino();
              await this.initializeLumino(true);
            }
          }
        } else {
          await this.operations.onboarding();
          state.apiKey = await this.operations.getApiKey();
          this.store.putState(state);
        }
      } catch (generalError) {
        console.error('Lumino SDK cannot initialize: ', generalError);
      }
    }
  };

  async destroyLumino () {
    await this.lumino.destroy();
    sdk = null;
    sdk = require('@rsksmart/lumino-light-client-sdk');
    this.lumino = sdk.Lumino;
  }

  onUnlock () {
    super.onUnlock();
    this.initializeLumino();
  }

  onNetworkChanged (network) {
    super.onNetworkChanged(network);
    this.initializeLumino(true);
  }

  onAddressChanged (address) {
    super.onAddressChanged(address);
    if (this.signingHandler) {
      this.signingHandler.address = address;
    }
    this.initializeLumino(true);
  }

  bindApi () {
    return {
      onboarding: bindOperation(this.operations.onboarding, this.operations),
      openChannel: bindOperation(this.operations.openChannel, this.operations),
      closeChannel: bindOperation(this.operations.closeChannel, this.operations),
      createDeposit: bindOperation(this.operations.createDeposit, this.operations),
      createPayment: bindOperation(this.operations.createPayment, this.operations),
      getChannels: bindOperation(this.operations.getChannels, this.operations),
      getApiKey: bindOperation(this.operations.getApiKey, this.operations),
      getAvailableCallbacks: bindOperation(this.callbacks.getAvailableCallbacks, this.callbacks),
      listenCallback: bindOperation(this.callbacks.listenForCallback, this.callbacks),
      getTokens: bindOperation(this.luminoExplorer.getTokens, this.luminoExplorer),
    };
  }

}
