import { IQuantumGate } from '../types/quantumGate';

export default class Z implements IQuantumGate {
  private modifier: number[][];
  private twoBitmodifier: number[][];
  public constructor() {
    this.modifier = [[1, 0], [0, -1]];
    this.twoBitmodifier = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, -1]
    ];
  }

  public getModifier() {
    return this.modifier;
  }

  public getTwoBitModifier() {
    return this.twoBitmodifier;
  }
}
