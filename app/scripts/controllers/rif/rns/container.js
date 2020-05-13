/**
 * Simple class to contains all the rns operations
 */
export class RnsContainer {
  constructor (props) {
    this.register = props.register;
    this.resolver = props.resolver;
    this.transfer = props.transfer;
    this.register.setContainer(this);
    this.resolver.setContainer(this);
    this.transfer.setContainer(this);
  }
}
