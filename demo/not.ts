import Qubit from '../src/qubit';
import Not from '../src/gates/not';

// Start with 0 base state
const q1 = new Qubit(0);

console.log('Zero Qubit', q1.measure());

// Apply NOT gate
console.log('After Not', new Qubit(0).apply(new Not()).measure());

console.log('-------------------');
