import { isEqual } from 'lodash';
import { Matrix, matrix, multiply, sqrt } from 'mathjs';
import {
  validateOperationOnItself,
  validateForEntanglement
} from './validation';
import Not from './gates/not';
import { ONE_STATE, ZERO_STATE } from './constants';
import { QuantumGate } from './gates/quantumGate';
import PhaseInverter from './gates/phaseInverter';
import EntangledQubit from './entangledQubit';

class InternalStateVisitor {
  private internalState?: number[];
  public visit(internalState: number[]) {
    this.internalState = internalState;
  }

  public getInternalState(): number[] | undefined {
    return this.internalState;
  }
}

const hadamardMatrix = [
  [1 / sqrt(2), 1 / sqrt(2)],
  [1 / sqrt(2), -1 / sqrt(2)]
];

const round = (num: number, precision = 0) =>
  Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);

const isAbsoluteZero = (state: number[]) =>
  state[0] === 1 && round(Math.pow(state[0], 2)) === 1;
const isAbsoluteOne = (state: number[]) =>
  state[0] === 0 && Math.pow(round(state[1]), 2) === 1;
const isSuperposedOne = (state: number[]) =>
  isAbsoluteOne(multiply(hadamardMatrix, state) as number[]);
const isSuperposed = (state: number[]) =>
  !(isAbsoluteZero(state) && isAbsoluteOne(state));
const isAbsolute = (state: number[]) =>
  isAbsoluteZero(state) || isAbsoluteOne(state);

const CNOT_MATRIX = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]];

const tensorProduct = (state: number[], anotherState: number[]) => [
  state[0] * anotherState[0],
  state[0] * anotherState[1],
  state[1] * anotherState[0],
  state[1] * anotherState[1]
];

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

  public apply(gate: QuantumGate) {
    const result = multiply(gate.getModifier(), this.internalState) as number[];
    if (result.length !== 2) {
      throw new Error('Only single bit gates can be applied.');
    }
    this.internalState = [...result];
    return this;
  }

  public acceptInternalStateVisitor(visitor: InternalStateVisitor) {
    visitor.visit(this.internalState);
    return visitor;
  }

  public cnot(thatQubit: Qubit) {
    validateOperationOnItself(this, thatQubit);
    const thatInternalState = thatQubit
      .acceptInternalStateVisitor(new InternalStateVisitor())
      .getInternalState()!;

    validateForEntanglement(this.internalState, thatInternalState);

    if (isAbsolute(this.internalState) && isAbsolute(thatInternalState)) {
      if (isAbsoluteOne(this.internalState)) {
        thatQubit.apply(new Not());
      }
    } else if (
      isSuperposed(this.internalState) &&
      isSuperposed(thatInternalState)
    ) {
      if (isSuperposedOne(thatInternalState)) {
        this.apply(new Not())
          .apply(new PhaseInverter())
          .apply(new Not());
      }
    } else {
      const qubitProduct = tensorProduct(this.internalState, thatInternalState);
      const cnotApplied = multiply(CNOT_MATRIX, qubitProduct) as number[];
      const entanlgedQubit = new EntangledQubit(cnotApplied);
    }

    return this;
  }

  public measure() {
    const zeroProbability = Math.pow(round(this.internalState[0], 5), 2);
    let value;
    if (zeroProbability === 0) {
      value = 1;
    } else if (zeroProbability === 1) {
      value = 0;
    } else {
      if (this.valueHistory.length === 0) {
        value = zeroProbability > 0.5 ? 0 : 1;
      } else {
        const numberOfZeroes = this.valueHistory.filter(val => val === 0)
          .length;
        value =
          numberOfZeroes / this.valueHistory.length <= zeroProbability ? 0 : 1;
      }
    }
    this.valueHistory.push(value);
    return value;
  }

  private invertState() {
    this.apply(new Not());
  }
}
