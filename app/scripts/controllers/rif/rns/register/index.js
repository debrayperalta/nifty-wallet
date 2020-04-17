import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsDelegate from '../rns-delegate'
import * as namehash from 'eth-ens-namehash'

export default class RnsRegister extends RnsDelegate {

  initialize () {
    this.fifsContractInstance = this.web3.eth.contract(FIFSRegistrar).at(this.rifConfig.rns.contracts.fifsRegistrar);
  }

  requestRegistration (domainName) {
    const domainHash = this.web3.utils.sha3(domainName);
    const secret = this.web3.utils.sha3('0x00');
    return new Promise((resolve, reject) => {
      this.fifsContractInstance['makeCommitment']
        .call(domainHash, this.selectedAccount, secret, (error, commitment) => {
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

  finishRegistration (domainName, commitHash, yearsToRegister) {
    return new Promise((resolve, reject) => {
      this.fifsContractInstance['register']
        .send(domainName, this.selectedAccount, commitHash, yearsToRegister, (error, hash) => {
          if (error) {
            reject(error);
          }
          console.debug(hash);
          console.debug('Domain registered!');
          resolve();
      });
    });
  }

  createSubdomain (domainName, subdomain, subdomainOwnerAddress) {
    return new Promise((resolve, reject) => {
      this.rnsContractInstance['setSubnodeOwner']
        .send(namehash.hash(domainName), this.web3.utils.sha3(subdomain), subdomainOwnerAddress, (error, result) => {
          if (error) {
            reject(error);
          }
          console.debug('Subdomain Created' + result);
          resolve(result);
      });
    });
  }

  getApi () {
    return {
      requestRegistration: this.requestRegistration.bind(this),
      finishRegistration: this.finishRegistration.bind(this),
      createSubdomain: this.createSubdomain.bind(this),
    }
  }
}
