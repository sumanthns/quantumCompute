import { multiply, sqrt } from 'mathjs';
import { validateOperationOnItself } from './validation';
import Not from './gates/not';
import { QuantumGate } from './gates/quantumGate';
import PhaseInverter from './gates/phaseInverter';
import EntangledQubit from './entangledQubit';
import Hadamard from './gates/hadamard';
import { shuffle, getRandomInt } from './helper';

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
  !(isAbsoluteZero(state) || isAbsoluteOne(state));
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
  private entangledQubit?: EntangledQubit;
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
    } else if (
      isSuperposed(this.internalState) &&
      isAbsolute(thatInternalState)
    ) {
      // Entanglement
      const qubitProduct = tensorProduct(this.internalState, thatInternalState);
      const cnotAppliedState = multiply(CNOT_MATRIX, qubitProduct) as number[];
      const entangledQubit = new EntangledQubit(cnotAppliedState);
      entangledQubit.register(this.internalState);
      if (typeof this.entangledQubit === 'undefined') {
        this.entangledQubit = entangledQubit;
        thatQubit.entangle(entangledQubit, this);
      }
    }

    return this;
  }

  public isEntangledTo(entangledQubit: EntangledQubit) {
    return this.entangledQubit === entangledQubit;
  }

  public entangle(entangledQubit: EntangledQubit, pair: Qubit) {
    if (
      typeof this.entangledQubit === 'undefined' &&
      pair.isEntangledTo(entangledQubit)
    ) {
      this.entangledQubit = entangledQubit;
      this.apply(new Hadamard());
      entangledQubit.register(this.internalState);
    }
  }

  public measure() {
    if (
      typeof this.entangledQubit !== 'undefined' &&
      isSuperposed(this.internalState)
    ) {
      this.entangledQubit.measure();
    }
    if (isAbsoluteZero(this.internalState)) {
      return 0;
    }
    if (isAbsoluteOne(this.internalState)) {
      return 1;
    }
    const zeroProbability = Math.pow(round(this.internalState[0], 5), 2);
    const oneProbaility = 1 - zeroProbability;
    const probabilityArray = [];
    for (let i = 0; i < zeroProbability * 100; i++) {
      probabilityArray.push(0);
    }

    for (let i = 0; i < oneProbaility * 100; i++) {
      probabilityArray.push(1);
    }

    shuffle(probabilityArray);
    const value = probabilityArray[getRandomInt(99)];
    if (value === 0) {
      this.internalState = [1, 0];
    } else if (value === 1) {
      this.internalState = [0, 1];
    }
    return value;
  }
}
