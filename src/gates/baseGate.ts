import Qubit from '../qubit';

export default abstract class BaseGate {
  private state: number[][];

  constructor(state: number[][]) {
    this.state = state;
  }

  public act(qubit: Qubit) {
    qubit.apply(this);
  }

  public getState() {
    return this.state;
  }
}
