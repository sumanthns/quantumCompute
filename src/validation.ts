import Qubit from './qubit';

export const validateOperationOnItself = (
  qubit: Qubit,
  anotherQubit: Qubit
) => {
  if (qubit === anotherQubit) {
    throw new Error(
      'Cnot operation can only be performed on two different qubits.'
    );
  }
};
