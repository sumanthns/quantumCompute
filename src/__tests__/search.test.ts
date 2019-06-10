import Qubit from '../qubit';
import Hadamard from '../gates/hadamard';
import GroverDiffusion from '../gates/groverDiffusion';

describe('Grovers search', () => {
  it('should output the correct search key for a given result in ay array of 4 elements in one iteration', () => {
    const qubit1 = new Qubit(0);
    const qubit2 = new Qubit(0);

    qubit1.apply(new Hadamard());
    qubit2.apply(new Hadamard());

    // apply Oracle function for 4th|11> index
    qubit2.apply(new Hadamard());
    qubit1.cnot(qubit2);
    qubit2.apply(new Hadamard());

    // apply Grover's diffusion
    qubit1.apply(new GroverDiffusion());

    expect(qubit1.measure()).toBe(1);
    expect(qubit2.measure()).toBe(1);
  });
});
