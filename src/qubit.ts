import { isEqual } from 'lodash';
import BaseGate from './gates/baseGate';
import lookUpOnBlochCircle from './gates/blochCircle';
import { validateCnotOperation } from './validation';
import Not from './gates/not';
import EntangledQubit from './entangledQubit';

class InternalStateVisitor {
  private internalState?: number[];
  public visit(qubit: Qubit) {
    qubit.acceptInternalStateVisitor(this);
    return this;
  }

  public setInternalState(internalState: number[]) {
    this.internalState = internalState;
  }

  public getInternalState(): number[] | undefined {
    return this.internalState;
  }
}

export default class Qubit {
  private internalState: number[];
  private valueHistory: number[] = [];
  private entagledQubit?: Qubit;
  private superImposed: boolean = false;
  private measured: boolean = false;
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
    if (gateType === '50H') {
      this.superImposed = !this.superImposed;
    }
    this.internalState = lookUpOnBlochCircle(this.internalState, gateType);
    return this;
  }

  public acceptInternalStateVisitor(visitor: InternalStateVisitor) {
    visitor.setInternalState(this.internalState);
  }

  public cnot(anotherQubit: Qubit) {
    validateCnotOperation(this, anotherQubit);
    if (this.isSuperimposed() !== anotherQubit.isSuperimposed()) {
      // return new EntangledQubit(this, anotherQubit);
      return this;
    } else {
      if (!anotherQubit.isSuperimposed()) {
        const controlValue = anotherQubit.measure();
        if (controlValue === 1) {
          this.invertState();
        }
      } else {
        const controlState = new InternalStateVisitor()
          .visit(anotherQubit)
          .getInternalState();
        if (
          isEqual(controlState, [0, 1]) ||
          isEqual(controlState, [Math.sqrt(0.5), -Math.sqrt(0.5)])
        ) {
          this.invertState();
        }
      }
      return this;
    }
  }

  public isEntangled(anotherQubit: Qubit) {
    return this.entagledQubit === anotherQubit;
  }

  public establishMutualEntanglement(anotherQubit: Qubit) {
    if (
      this.canEntangle() &&
      anotherQubit.isEntangled(this) &&
      typeof this.entagledQubit === 'undefined'
    ) {
      this.entagledQubit = anotherQubit;
      return this.internalState;
    }
  }

  public canEntangle() {
    return (
      typeof this.entagledQubit === 'undefined' && this.superImposed === true
    );
  }

  public isSuperimposed() {
    return this.superImposed;
  }

  public isMeasured() {
    return this.measured;
  }

  public measure() {
    let finalValue;
    this.measured = true;
    if (isEqual(this.internalState, [1, 0])) {
      finalValue = 0;
    } else if (isEqual(this.internalState, [0, 1])) {
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
    if (
      typeof this.entagledQubit !== 'undefined' &&
      !this.entagledQubit.isMeasured()
    ) {
      this.entagledQubit.measure();
    }
    return finalValue;
  }

  private entangle(anotherQubit: Qubit) {
    this.entagledQubit = anotherQubit;
    return anotherQubit.establishMutualEntanglement(this);
  }

  private invertState() {
    this.apply(new Not());
  }
}
