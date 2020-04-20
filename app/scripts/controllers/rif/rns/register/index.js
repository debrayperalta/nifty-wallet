import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsJsDelegate from '../rnsjs-delegate'

/**
 * This is a delegate to manage all the RNS register operations.
 */
export default class RnsRegister extends RnsJsDelegate {

  initialize () {
    this.fifsContractInstance = this.web3.eth.contract(FIFSRegistrar).at(this.rifConfig.rns.contracts.fifsRegistrar);
  }

  buildApi () {
    const rnsJsApi = super.buildApi();
    return {
      requestRegistration: this.requestRegistration.bind(this),
      finishRegistration: this.finishRegistration.bind(this),
      ...rnsJsApi,
    }
  }

  /**
   * Make a request for registration on the domainName.
   * @param domainName the Domain to register.
   * @returns {Promise<string>} commitHash to use on the finishRegistration operation.
   */
  requestRegistration (domainName) {
    const domainHash = this.web3.utils.sha3(domainName);
    const secret = this.web3.utils.sha3('0x00');
    return new Promise((resolve, reject) => {
      this.fifsContractInstance['makeCommitment']
        .call(domainHash, this.address, secret, (error, commitment) => {
          if (error) {
            reject(error);
          }
          console.debug('Commitment: ' + commitment);
          this.fifsContractInstance['commit'].send({
            commitment: commitment,
          }, (error, commitHash) => {
            if (error) {
              reject(error);
            }
            console.debug('Commitment commited, wait 1 minute before reveal');
            console.debug(commitHash);
            resolve(commitHash);
          });
      });
    });
  }

  /**
   * Finish the domain registration using the hash from the requestRegistration operation.
   * @param domainName the Domain to be registered.
   * @param commitHash the commit hash from the first request.
   * @param yearsToRegister the amount of years to register the domain.
   * @returns {Promise<void>}
   */
  finishRegistration (domainName, commitHash, yearsToRegister) {
    return new Promise((resolve, reject) => {
      this.fifsContractInstance['register']
        .send(domainName, this.address, commitHash, yearsToRegister, (error, hash) => {
          if (error) {
            reject(error);
          }
          console.debug(hash);
          console.debug('Domain registered!');
          resolve();
      });
    });
  }

}
