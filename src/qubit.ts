import { isEqual } from 'lodash';
import BaseGate from './gates/baseGate';
import lookUpOnBlochCircle from './gates/blochCircle';
import {
  validateOperationOnItself,
  validateForEntanglement
} from './validation';
import Not from './gates/not';
import { ONE_STATE, ZERO_STATE } from './constants';

class InternalStateVisitor {
  private internalState?: number[];
  public visit(internalState: number[]) {
    this.internalState = internalState;
  }

  public getInternalState(): number[] | undefined {
    return this.internalState;
  }
}

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
    const gateType = gate.getType();
    this.internalState = lookUpOnBlochCircle(this.internalState, gateType);
    return this;
  }

  public acceptInternalStateVisitor(visitor: InternalStateVisitor) {
    visitor.visit(this.internalState);
    return visitor;
  }

  public cnot(anotherQubit: Qubit) {
    validateOperationOnItself(this, anotherQubit);
    const controlState = anotherQubit
      .acceptInternalStateVisitor(new InternalStateVisitor())
      .getInternalState()!;

    validateForEntanglement(this.internalState, controlState);

    if (
      isEqual(controlState, ONE_STATE) ||
      isEqual(controlState, [Math.sqrt(0.5), -Math.sqrt(0.5)])
    ) {
      this.invertState();
    }
    return this;
  }

  public measure() {
    let finalValue;
    if (isEqual(this.internalState, ZERO_STATE)) {
      finalValue = 0;
    } else if (isEqual(this.internalState, ONE_STATE)) {
      finalValue = 1;
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
      finalValue = value;
    }
    return finalValue;
  }

  private invertState() {
    this.apply(new Not());
  }
}
