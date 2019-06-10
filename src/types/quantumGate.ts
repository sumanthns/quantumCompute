import math from 'mathjs';

export interface IQuantumGate {
  getModifier(): number[][];
  getTwoBitModifier(): number[][];
}
