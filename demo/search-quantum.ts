import Qubit from '../src/qubit';
import Hadamard from '../src/gates/hadamard';
import Not from '../src/gates/not';
import GroverDiffusion from '../src/gates/groverDiffusion';

const oracle = (qubit1: Qubit, qubit2: Qubit) => {
  // apply Oracle function |10> state
  // This creates an entanglement
  qubit2.apply(new Hadamard()).apply(new Not());
  qubit1.cnot(qubit2);
  qubit2.apply(new Hadamard());
  return [qubit1, qubit2];
};

let qubit1 = new Qubit(0);
let qubit2 = new Qubit(0);

qubit1.apply(new Hadamard());
qubit2.apply(new Hadamard());

[qubit1, qubit2] = oracle(qubit1, qubit2);

// apply Grover's diffusion
qubit1.apply(new GroverDiffusion());

const lookup: { [key: string]: string } = {
  '10': 'secret-password',
  '11': 'password',
  '00': 'password-secret',
  '01': 'secret'
};

const lookUpValue = `${qubit1.measure()}${qubit2.measure()}`;

console.log(`Password is ${lookup[lookUpValue]}`);
