import Qubit from '../qubit';
import Hadamard from '../gates/hadamard';
import GroverDiffusion from '../gates/groverDiffusion';
import Not from '../gates/not';

describe('Grovers search', () => {
  it('should output the 1st search key for a given result in ay array of 4 elements in one iteration', () => {
    const qubit1 = new Qubit(0);
    const qubit2 = new Qubit(0);

    qubit1.apply(new Hadamard());
    qubit2.apply(new Hadamard());

    // apply Oracle function for 1st, |00> index
    // This creates an entanglement
    qubit1
      .apply(new Hadamard())
      .apply(new Not())
      .apply(new Hadamard());
    qubit2.apply(new Hadamard()).apply(new Not());
    qubit1.cnot(qubit2);
    qubit2.apply(new Hadamard());

    // apply Grover's diffusion
    qubit1.apply(new GroverDiffusion());

    expect(qubit1.measure()).toBe(0);
    expect(qubit2.measure()).toBe(0);
  });

  it('should output the 2nd search key for a given result in ay array of 4 elements in one iteration', () => {
    const qubit1 = new Qubit(0);
    const qubit2 = new Qubit(0);

    qubit1.apply(new Hadamard());
    qubit2.apply(new Hadamard());

    // apply Oracle function for 2nd, |10> index
    // This creates an entanglement
    qubit2.apply(new Hadamard()).apply(new Not());
    qubit1.cnot(qubit2);
    qubit2.apply(new Hadamard());

    // apply Grover's diffusion
    qubit1.apply(new GroverDiffusion());

    expect(qubit1.measure()).toBe(1);
    expect(qubit2.measure()).toBe(0);
  });

  it('should output the 3rd search key for a given result in ay array of 4 elements in one iteration', () => {
    const qubit1 = new Qubit(0);
    const qubit2 = new Qubit(0);

    qubit1.apply(new Hadamard());
    qubit2.apply(new Hadamard());

    // apply Oracle function for 3rd, |01> index
    // This creates an entanglement
    qubit1
      .apply(new Hadamard())
      .apply(new Not())
      .apply(new Hadamard());
    qubit2.apply(new Hadamard());
    qubit1.cnot(qubit2);
    qubit2.apply(new Hadamard());

    // apply Grover's diffusion
    qubit1.apply(new GroverDiffusion());

    expect(qubit1.measure()).toBe(0);
    expect(qubit2.measure()).toBe(1);
  });

  it('should output the 4th search key for a given result in ay array of 4 elements in one iteration', () => {
    const qubit1 = new Qubit(0);
    const qubit2 = new Qubit(0);

    qubit1.apply(new Hadamard());
    qubit2.apply(new Hadamard());

    // apply Oracle function for 4th, |11> index
    // This creates an entanglement
    qubit2.apply(new Hadamard());
    qubit1.cnot(qubit2);
    qubit2.apply(new Hadamard());

    // apply Grover's diffusion
    qubit1.apply(new GroverDiffusion());

    expect(qubit1.measure()).toBe(1);
    expect(qubit2.measure()).toBe(1);
  });
});
