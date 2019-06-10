import { multiply } from 'mathjs';
import { shuffle, getRandomInt } from './helper';
import { IQuantumGate } from './types/quantumGate';
import { IQubit } from './types/qubit';

const ZERO_ZERO = 1;
const ONE_ZERO = 2;
const ZERO_ONE = 3;
const ONE_ONE = 4;

export default class EntangledQubit implements IQubit {
  private internalState: number[];
  private pairedQubitStates: number[][] = [];
  constructor(state: number[]) {
    this.internalState = [...state];
  }

  public register(state: number[]) {
    if (!this.pairedQubitStates.includes(state)) {
      this.pairedQubitStates.push(state);
    }
  }

  public cnot(_: IQubit) {
    return _;
  }

  public apply(gate: IQuantumGate) {
    const result = multiply(
      gate.getTwoBitModifier(),
      this.internalState
    ) as number[];
    this.internalState = [...result];
    return this;
  }

  public measure() {
    const [
      probBothZero,
      probOneZero,
      probZeroOne,
      probBothOne
    ] = this.internalState.map(bit => Math.pow(bit, 2));

    const probabilityArray = [];
    for (let i = 0; i < probBothZero * 100; i++) {
      probabilityArray.push(ZERO_ZERO);
    }
    for (let i = 0; i < probOneZero * 100; i++) {
      probabilityArray.push(ONE_ZERO);
    }
    for (let i = 0; i < probZeroOne * 100; i++) {
      probabilityArray.push(ZERO_ONE);
    }
    for (let i = 0; i < probBothOne * 100; i++) {
      probabilityArray.push(ONE_ONE);
    }
    shuffle(probabilityArray);
    const randomValue = probabilityArray[getRandomInt(99)];

    switch (randomValue) {
      case ZERO_ZERO: {
        this.pairedQubitStates[0][0] = 1;
        this.pairedQubitStates[0][1] = 0;
        this.pairedQubitStates[1][0] = 1;
        this.pairedQubitStates[1][1] = 0;
        break;
      }

      case ONE_ZERO: {
        this.pairedQubitStates[0][0] = 0;
        this.pairedQubitStates[0][1] = 1;
        this.pairedQubitStates[1][0] = 1;
        this.pairedQubitStates[1][1] = 0;
        break;
      }

      case ZERO_ONE: {
        this.pairedQubitStates[0][0] = 1;
        this.pairedQubitStates[0][1] = 0;
        this.pairedQubitStates[1][0] = 0;
        this.pairedQubitStates[1][1] = 1;
        break;
      }

      case ONE_ONE: {
        this.pairedQubitStates[0][0] = 0;
        this.pairedQubitStates[0][1] = 1;
        this.pairedQubitStates[1][0] = 0;
        this.pairedQubitStates[1][1] = 1;
        break;
      }
    }
    return randomValue;
  }
}
