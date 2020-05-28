# Nifty Wallet Browser Extension
[![Build Status](https://circleci.com/gh/poanetwork/nifty-wallet.svg?style=shield)](https://circleci.com/gh/poanetwork/nifty-wallet) [![Coverage Status](https://coveralls.io/repos/github/poanetwork/nifty-wallet/badge.svg?branch=master)](https://coveralls.io/github/poanetwork/nifty-wallet?branch=master)

## Introduction

[Internal documentation](./docs#documentation)

## RIF

Before you try to build this you need to deploy
 [rns-suite](https://github.com/rnsdomains/rns-suite) contracts into the 
chain that you are working on. In the case you are testing using a real chain
you should have the contracts addresses needed for this. After you have those 
addresses you need to fill the file `rif/rif.config.{environment}.js` with those values, an example could be:

```js
module.exports = {
  rns: {
    contracts: {
      rns: '0x03F23ae1917722d5A27a2Ea0Bcc98725a2a2a49a',
      registrar: '0xfD1dda8C3BC734Bc1C8e71F69F25BFBEe9cE9535',
      reverseRegistrar: '0x8901a2Bbf639bFD21A97004BA4D7aE2BD00B8DA8',
      publicResolver: '0x1eD614cd3443EFd9c70F04b6d777aed947A4b0c4',
      nameResolver: '0x0e19674ebc2c2B6Df3e7a1417c49b50235c61924',
      multiChainResolver: '0x5159345aaB821172e795d56274D0f5FDFdC6aBD9',
      rif: '0xdac5481925A298B95Bf5b54c35b68FC6fc2eF423',
      fifsRegistrar: '0x8921BF2f074b5470c02Cc7473F17282576111591',
      fifsAddrRegistrar: '0xc53A82b9B7c9af4801c7d8EA531719E7657aFF3C',
      rskOwner: '0xA66939ac57893C2E65425a5D66099Bc20C76D4CD',
      renewer: '0x23EF9610F53092A66bf224862BfD45216d9f3ea2',
      stringResolver: '0x20804b7317D2F4d0d2123f30c2D3A6B0E33DfB37',
    },
  },
}
```
As you can see in the file name we have a {environment} placeholder, that's because by default is production so
if you run ```yarn start``` the project will take the file ```rif/rif.config.production.js```. You can 
use any environment that you want, you just need to create a new file and then run the project
with ```yarn start --environment=environmentname```.
An example, let's say you have your environment setup and you put testing as the environment name. So you 
create a file in the folder rif inside the project root called ```rif.config.testing.js```, then you run
the project using this command ```yarn start --environment=testing``` that will load your environment
into the ```rif.config.js``` file in the root of the project. ```rif.config.js``` gets overwritten each time 
by the selected environment so don't use that file for setup. 

NOTE: This applies to builds too. So if you want to build a production bundle you don't need to do anything since
production is the default environment, but if you want to build another environment you need to specify the
argument on the build command.

## Building locally

 - Install [Node.js](https://nodejs.org/en/) version 10.x.x and npm version 6.13.4
   - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
   - Select npm 6.9.0: ```npm install -g npm@6.9.0```
 - Install dependencies: ```npm install```
 - Install gulp globally with `npm install -g gulp-cli`.
 - Build the project to the `./dist/` folder with `gulp build`.
 - Optionally, to rebuild on file changes, run `gulp dev`.
 - To package .zip files for distribution, run `gulp zip`, or run the full build & zip with `gulp dist`.

 Uncompressed builds can be found in `/dist`, compressed builds can be found in `/builds` once they're built.

### Running Tests

Requires `mocha` installed. Run `npm install -g mocha`.

Then just run `npm test`.

You can also test with a continuously watching process, via `npm run watch`.

You can run the linter by itself with `gulp lint`.

## Architecture

[![Architecture Diagram](./docs/architecture.png)][1]

## Development

```bash
npm install
npm start
```

## Build for Publishing

```bash
npm run dist
```

#### Writing Browser Tests

To write tests that will be run in the browser using QUnit, add your test files to `test/integration/lib`.

## Other Docs

- [How to add custom build to Chrome](./docs/add-to-chrome.md)
- [How to add custom build to Firefox](./docs/add-to-firefox.md)
- [How to develop a live-reloading UI](./docs/ui-dev-mode.md)
- [How to develop an in-browser mocked UI](./docs/ui-mock-mode.md)
- [How to live reload on local dependency changes](./docs/developing-on-deps.md)
- [How to manage notices that appear when the app starts up](./docs/notices.md)
- [How to use the TREZOR emulator](./docs/trezor-emulator.md)
- [How to generate a visualization of this repository's development](./docs/development-visualization.md)

[1]: http://www.nomnoml.com/#view/%5B%3Cactor%3Euser%5D%0A%0A%5Bmetamask-ui%7C%0A%20%20%20%5Btools%7C%0A%20%20%20%20%20react%0A%20%20%20%20%20redux%0A%20%20%20%20%20thunk%0A%20%20%20%20%20ethUtils%0A%20%20%20%20%20jazzicon%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%7C%0A%20%20%20%20%20app%0A%20%20%20%20%20account-detail%0A%20%20%20%20%20accounts%0A%20%20%20%20%20locked-screen%0A%20%20%20%20%20restore-vault%0A%20%20%20%20%20identicon%0A%20%20%20%20%20config%0A%20%20%20%20%20info%0A%20%20%20%5D%0A%20%20%20%5Breducers%7C%0A%20%20%20%20%20app%0A%20%20%20%20%20metamask%0A%20%20%20%20%20identities%0A%20%20%20%5D%0A%20%20%20%5Bactions%7C%0A%20%20%20%20%20%5BaccountManager%5D%0A%20%20%20%5D%0A%20%20%20%5Bcomponents%5D%3A-%3E%5Bactions%5D%0A%20%20%20%5Bactions%5D%3A-%3E%5Breducers%5D%0A%20%20%20%5Breducers%5D%3A-%3E%5Bcomponents%5D%0A%5D%0A%0A%5Bweb%20dapp%7C%0A%20%20%5Bui%20code%5D%0A%20%20%5Bweb3%5D%0A%20%20%5Bmetamask-inpage%5D%0A%20%20%0A%20%20%5B%3Cactor%3Eui%20developer%5D%0A%20%20%5Bui%20developer%5D-%3E%5Bui%20code%5D%0A%20%20%5Bui%20code%5D%3C-%3E%5Bweb3%5D%0A%20%20%5Bweb3%5D%3C-%3E%5Bmetamask-inpage%5D%0A%5D%0A%0A%5Bmetamask-background%7C%0A%20%20%5Bprovider-engine%5D%0A%20%20%5Bhooked%20wallet%20subprovider%5D%0A%20%20%5Bid%20store%5D%0A%20%20%0A%20%20%5Bprovider-engine%5D%3C-%3E%5Bhooked%20wallet%20subprovider%5D%0A%20%20%5Bhooked%20wallet%20subprovider%5D%3C-%3E%5Bid%20store%5D%0A%20%20%5Bconfig%20manager%7C%0A%20%20%20%20%5Brpc%20configuration%5D%0A%20%20%20%20%5Bencrypted%20keys%5D%0A%20%20%20%20%5Bwallet%20nicknames%5D%0A%20%20%5D%0A%20%20%0A%20%20%5Bprovider-engine%5D%3C-%5Bconfig%20manager%5D%0A%20%20%5Bid%20store%5D%3C-%3E%5Bconfig%20manager%5D%0A%5D%0A%0A%5Buser%5D%3C-%3E%5Bmetamask-ui%5D%0A%0A%5Buser%5D%3C%3A--%3A%3E%5Bweb%20dapp%5D%0A%0A%5Bmetamask-contentscript%7C%0A%20%20%5Bplugin%20restart%20detector%5D%0A%20%20%5Brpc%20passthrough%5D%0A%5D%0A%0A%5Brpc%20%7C%0A%20%20%5Bethereum%20blockchain%20%7C%0A%20%20%20%20%5Bcontracts%5D%0A%20%20%20%20%5Baccounts%5D%0A%20%20%5D%0A%5D%0A%0A%5Bweb%20dapp%5D%3C%3A--%3A%3E%5Bmetamask-contentscript%5D%0A%5Bmetamask-contentscript%5D%3C-%3E%5Bmetamask-background%5D%0A%5Bmetamask-background%5D%3C-%3E%5Bmetamask-ui%5D%0A%5Bmetamask-background%5D%3C-%3E%5Brpc%5D%0A
