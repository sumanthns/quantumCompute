import hash from 'object-hash';
import { shuffle } from '../src/helper';

const myHash = 'b53526e3f6058f9a099dd85738fa79018957c8d1';

const oracle = (input: string) => {
  if (hash(input) === myHash) {
    return 1;
  }
  return 0;
};

const knownPasswords = [
  'secret',
  'secretPassword',
  'secret-password',
  'password-secret'
];

shuffle(knownPasswords);
let i = 1;
for (const password of knownPasswords) {
  if (oracle(password) === 1) {
    console.log(`Password is ${password}, found after ${i} attempts`);
    break;
  }
  i++;
}
