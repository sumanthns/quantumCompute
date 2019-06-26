import Qubit from '../src/qubit';
import Not from '../src/gates/not';
import Hadamard from '../src/gates/hadamard';

const blackBoxFunctions = [
  {
    type: 'constant',
    name: 'constant 0',
    action: (q1: Qubit, q2: Qubit) => {
      return [q1, q2];
    }
  },
  {
    type: 'constant',
    name: 'constant 1',
    action: (q1: Qubit, q2: Qubit) => {
      return [q1.apply(new Not()), q2];
    }
  },
  {
    type: 'variable',
    name: 'Inverse',
    action: (q1: Qubit, q2: Qubit) => {
      return [q1.cnot(q2), q2];
    }
  },
  {
    type: 'variable',
    name: 'Inverse',
    action: (q1: Qubit, q2: Qubit) => {
      return [q1.cnot(q2).apply(new Not()), q2];
    }
  }
];

const randomBlackBoxIndex = Math.floor(
  Math.random() * blackBoxFunctions.length
);
const randomBlackBox = blackBoxFunctions[randomBlackBoxIndex];

const q1 = new Qubit(0).apply(new Not()).apply(new Hadamard()) as Qubit;
const q2 = new Qubit(0).apply(new Not()).apply(new Hadamard()) as Qubit;

const outputs = randomBlackBox.action(q1, q2);
console.log(
  `Result`,
  outputs[0]
    .apply(new Hadamard())
    .apply(new Not())
    .measure(),
  `BlackBoxType`,
  randomBlackBox.type
);
