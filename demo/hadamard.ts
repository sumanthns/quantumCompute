import Qubit from '../src/qubit';
import Hadamard from '../src/gates/hadamard';

// Apply Hadamard gate to Zero Qubit
console.log(
  'Zero Qubit After Hadamard',
  new Qubit(0).apply(new Hadamard()).measure()
);

// Apply Hadamard gate to One Qubit
console.log(
  'One Qubit After Hadamard',
  new Qubit(1).apply(new Hadamard()).measure()
);

console.log('-------------------');
