export default class Token {
  constructor (name, symbol, address, channels, networkAddress, joined) {
    this.name = name;
    this.symbol = symbol;
    this.address = address;
    this.channels = channels;
    this.network_address = networkAddress;
    this.joined = joined;
  }
}
