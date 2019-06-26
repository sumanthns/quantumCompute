import Qubit from '../src/qubit';
import Hadamard from '../src/gates/hadamard';

// Start with 0 base state and move to spuperposition
const q1 = new Qubit(0).apply(new Hadamard());

// Start with 0 base state
const q2 = new Qubit(1);

q1.cnot(q2);

// Q1 and Q2 should now be in opposite entanglement
console.log('Q1: ', q1.measure(), 'Q2: ', q2.measure());

console.log('-------------------');
