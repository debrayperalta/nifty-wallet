export default class Token {
  constructor (name, symbol, address, networkChannels, userChannels, networkAddress, joined) {
    this.name = name;
    this.symbol = symbol;
    this.address = address;
    this.networkChannels = networkChannels;
    this.userChannels = userChannels;
    this.network_address = networkAddress;
    this.joined = joined;
  }
}
