/**
 * Here we have all the rns constant definitions
 */
export const rns = {
  // this is to specify the containers on the stores when we want to retrieve or update data from them.
  storeContainers: {
    register: 'register',
    resolver: 'resolver',
    transfer: 'transfer',
  },
  zeroAddress: '0x0000000000000000000000000000000000000000',
  domainRegister: {
    secondsToRevealCommitment: 60,
    secondsToUpdateCommitment: 2,
    minutesWaitingForCommitmentReveal: 2,
  },
}
