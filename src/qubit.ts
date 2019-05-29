import * as _ from 'lodash';
import BaseGate from './gates/baseGate';

const isUnitProbabiltyOverall = (state: number[]) =>
  _.round(Math.pow(state[0], 2) + Math.pow(state[1], 2), 5) == 1;

export default class Qubit {
  private internalState: number[];
  private valueHistory: number[] = [];
  constructor(type: number) {
    if (type === 0) {
      this.internalState = [1, 0];
    } else if (type === 1) {
      this.internalState = [0, 1];
    } else {
      throw new Error(
        'Sigh... Stuck in 4 dimensional quantum world. I pity you mortal 🖖'
      );
    }
  }

  public apply(gate: BaseGate) {
    const gateState = gate.getState();
    if (
      gateState.length !== 2 ||
      gateState[0].length !== 2 ||
      gateState[1].length !== 2
    ) {
      throw new Error('Gate should be a 2 * 2 matrix.');
    }

    if (
      !isUnitProbabiltyOverall(gateState[0]) ||
      !isUnitProbabiltyOverall(gateState[1])
    ) {
      throw new Error('Total probability of each gate state should be 1.');
    }

    this.internalState = [
      gateState[0][0] * this.internalState[0] +
        gateState[1][0] * this.internalState[1],
      gateState[0][1] * this.internalState[0] +
        gateState[1][1] * this.internalState[1]
    ];
    return this;
  }

  public show() {
    if (this.internalState[0] === 1) {
      return 0;
    } else if (this.internalState[0] === 0) {
      return 1;
    } else {
      const zeroProbability = Math.pow(this.internalState[0], 2);
      let value;
      if (this.valueHistory.length === 0) {
        value = zeroProbability > 0.5 ? 0 : 1;
      } else {
        const numberOfZeroes = this.valueHistory.filter(val => val === 0)
          .length;
        value =
          numberOfZeroes / this.valueHistory.length <= zeroProbability ? 0 : 1;
      }
      this.valueHistory.push(value);
      return value;
    }
  }
}
