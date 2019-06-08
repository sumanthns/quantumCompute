import { isEqual } from 'lodash';
import Qubit from './qubit';
import { ZERO_STATE, ONE_STATE } from './constants';

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

const isSuperposed = (internalState: number[]) => {
  return !(
    isEqual(internalState, ZERO_STATE) || isEqual(internalState, ONE_STATE)
  );
};

export const validateForEntanglement = (
  inputState: number[],
  controlState: number[]
) => {
  if (isSuperposed(inputState) !== isSuperposed(controlState)) {
    throw new Error('Cannot perform cnot. Results in entanglement.');
  }
};
