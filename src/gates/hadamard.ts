import { sqrt } from 'mathjs';
import { QuantumGate } from './quantumGate';

export default class Hadamard implements QuantumGate {
  private modifier: number[][];
  public constructor() {
    const superpose = 1 / sqrt(2);
    this.modifier = [[superpose, superpose], [superpose, -superpose]];
  }

  public getModifier() {
    return this.modifier;
  }
}
