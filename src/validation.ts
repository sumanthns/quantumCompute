import { IQubit } from './types/qubit';

export const validateOperationOnItself = (
  qubit: IQubit,
  anotherQubit: IQubit
) => {
  if (qubit === anotherQubit) {
    throw new Error(
      'Cnot operation can only be performed on two different qubits.'
    );
  }
};
