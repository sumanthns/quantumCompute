import Qubit from './qubit';

export default class EntangledQubit {
  private internalState: number[];
  constructor(state: number[]) {
    this.internalState = [...state];
  }
}
