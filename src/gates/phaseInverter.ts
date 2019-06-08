import { QuantumGate } from './quantumGate';

export default class PhaseInverter implements QuantumGate {
  private modifier: number[][];
  public constructor() {
    this.modifier = [[-1, 0], [0, 1]];
  }

  public getModifier() {
    return this.modifier;
  }
}
