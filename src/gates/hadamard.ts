import BaseGate from './baseGate';

export default class Hadamard extends BaseGate {
  constructor(ratio: number) {
    super([
      [Math.sqrt(ratio), Math.sqrt(1 - ratio)],
      [Math.sqrt(ratio), -Math.sqrt(1 - ratio)]
    ]);
  }
}
