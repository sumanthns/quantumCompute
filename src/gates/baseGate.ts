import Qubit from '../qubit';

export default abstract class BaseGate {
  private type: string;

  public constructor(type: string) {
    this.type = type;
  }

  public getType() {
    return this.type;
  }
}
