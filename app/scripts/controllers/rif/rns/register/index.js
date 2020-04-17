import FIFSRegistrar from '../abis/FIFSRegistrar.json'
import RnsDelegate from '../rns-delegate'
import * as namehash from 'eth-ens-namehash'

export default class RnsRegister extends RnsDelegate {

  constructor (props) {
    super(props)
    this.gas = 200000
  }

  initialize () {
    this.fifsContractInstance = new this.web3.eth.Contract(FIFSRegistrar, this.rifConfig.rns.contracts.fifsRegistrar)
  }

  requestRegistration (domainName, newOwnerAddress) {
    const domainHash = this.web3.utils.sha3(domainName)
    const secret = this.web3.utils.sha3('0x00')
    return new Promise((resolve, reject) => {
      this.fifsContractInstance.methods.makeCommitment(domainHash, newOwnerAddress, secret)
        .call({from: newOwnerAddress})
        .then((commitment) => {
          console.debug('Commitment: ' + commitment)
          this.fifsContractInstance.methods.commit(commitment)
            .send({from: newOwnerAddress})
            .then((commitHash) => {
              console.debug('Commitment commited, wait 1 minute before reveal')
              console.debug(commitHash)
              resolve(commitHash)
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))
    })
  }

  finishRegistration (domainName, commitHash, yearsToRegister) {
    return new Promise((resolve, reject) => {
      this.fifsContractInstance.methods.register(domainName, this.selectedAccount, commitHash, yearsToRegister)
        .send({from: this.selectedAccount, gas: this.gas})
        .then((hash) => {
          console.debug(hash)
          console.debug('Domain registered!')
          resolve()
        })
        .catch((error) => reject(error))
    })
  }

  createSubdomain (domainName, subdomain, subdomainOwnerAddress) {
    return new Promise((resolve, reject) => {
      this.rnsContractInstance.methods.setSubnodeOwner(namehash.hash(domainName), this.web3.utils.sha3(subdomain), subdomainOwnerAddress)
        .send({from: this.selectedAccount, gas: this.gas})
        .then((result) => {
          console.debug('Subdomain Created' + result)
          resolve(result)
        })
        .catch(error => reject(error))
    })
  }

  getApi () {
    return {
      requestRegistration: this.requestRegistration,
      finishRegistration: this.finishRegistration,
      createSubdomain: this.createSubdomain,
    }
  }
}
