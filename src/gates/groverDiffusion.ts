import { IQuantumGate } from '../types/quantumGate';

export default class GroverDiffusion implements IQuantumGate {
  private modifier: number[][];
  private twoBitmodifier: number[][];
  public constructor() {
    this.modifier = [[-1, 1], [1, -1]];
    this.twoBitmodifier = [
      [-0.5, 0.5, 0.5, 0.5],
      [0.5, -0.5, 0.5, 0.5],
      [0.5, 0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5, -0.5]
    ];
  }

  public getModifier() {
    return this.modifier;
  }

  public getTwoBitModifier() {
    return this.twoBitmodifier;
  }
}
