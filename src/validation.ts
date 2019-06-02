import Qubit from './qubit';

export const validateCnotOperation = (qubit: Qubit, anotherQubit: Qubit) => {
  if (qubit === anotherQubit) {
    throw new Error(
      'Cnot operation can only be performed on two different qubits.'
    );
  }
  if (qubit.isSuperimposed() !== anotherQubit.isSuperimposed()) {
    throw new Error(
      'Cnot operation can only be performed between two superimposed qubits or two absolute qubits.'
    );
  }

  if (
    qubit.isSuperimposed() &&
    !(qubit.canEntangle() && anotherQubit.canEntangle())
  ) {
    throw new Error(
      'Could not entangle given qubits. Entanglement is essential in performing cnot of a superimposed qubit.'
    );
  }
};
