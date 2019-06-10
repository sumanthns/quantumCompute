import { sqrt } from 'mathjs';
import { IQuantumGate } from '../types/quantumGate';

export default class Hadamard implements IQuantumGate {
  private modifier: number[][];
  private twoBitmodifier: number[][];
  public constructor() {
    const superpose = 1 / sqrt(2);
    this.modifier = [[superpose, superpose], [superpose, -superpose]];
    this.twoBitmodifier = [
      [superpose, superpose, 0, 0],
      [superpose, -superpose, 0, 0],
      [0, 0, superpose, superpose],
      [0, 0, superpose, -superpose]
    ];
  }

  public getModifier() {
    return this.modifier;
  }

  public getTwoBitModifier() {
    return this.twoBitmodifier;
  }
}
