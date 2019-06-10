import { IQuantumGate } from './quantumGate';

export interface IQubit {
  apply(gate: IQuantumGate): IQubit;
  measure(): number;
  cnot(qubit: IQubit): IQubit;
}
