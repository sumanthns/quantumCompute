import math from 'mathjs';

export interface QuantumGate {
  getModifier(): number[][];
}
