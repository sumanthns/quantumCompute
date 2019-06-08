import { QuantumGate } from './quantumGate';

export default class Not implements QuantumGate {
  private modifier: number[][];
  public constructor() {
    this.modifier = [[0, 1], [1, 0]];
  }

  public getModifier() {
    return this.modifier;
  }
}
