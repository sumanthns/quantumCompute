import Qubit from '../qubit';
import Hadamard from '../gates/hadamard';
import Not from '../gates/not';

describe('qubit', () => {
  describe('create', () => {
    it('should create a qubit for 0 state', () => {
      expect(new Qubit(0)).toBeDefined();
    });
    it('should create a qubit for 1 state', () => {
      expect(new Qubit(1)).toBeDefined();
    });
    it('should throw on creating qubit with any other state', () => {
      expect(() => new Qubit(0.2)).toThrow(
        'Sigh... Stuck in 4 dimensional quantum world. I pity you mortal 🖖'
      );
      expect(() => new Qubit(-1)).toThrow(
        'Sigh... Stuck in 4 dimensional quantum world. I pity you mortal 🖖'
      );
    });
  });

  describe('apply hadamard', () => {
    it('should show 50% chance measuring to 0 or 1 on applying a 50% hadamard gate for a 0 qubit initial', () => {
      const qubit = new Qubit(0);
      const hadamardFiftyPC = new Hadamard();

      qubit.apply(hadamardFiftyPC);

      let count = 0;
      const results = [];
      while (count < 10) {
        results.push(qubit.measure());
        count += 1;
      }
      const zeroes = results.filter(r => r === 0);
      const ones = results.filter(r => r === 1);

      expect(zeroes.length).toBe(5);
      expect(ones.length).toBe(5);
    });

    [0, 1].forEach(initialState =>
      it(`should be reversed to its ${initialState} state on applying 50% hadamard gate twice`, () => {
        const qubit = new Qubit(initialState);
        const hadamard = new Hadamard();

        qubit.apply(hadamard).apply(hadamard);

        let count = 0;
        const results = [];
        while (count < 10) {
          results.push(qubit.measure());
          count += 1;
        }
        const zeroes = results.filter(r => r === 0);
        const ones = results.filter(r => r === 1);

        if (initialState === 0) {
          expect(zeroes.length).toBe(10);
          expect(ones.length).toBe(0);
        } else {
          expect(zeroes.length).toBe(0);
          expect(ones.length).toBe(10);
        }
      })
    );
  });

  describe('not', () => {
    it('should negate the current state of absolute qubit', () => {
      const notGate = new Not();
      expect(new Qubit(0).apply(notGate).measure()).toEqual(1);
      expect(new Qubit(1).apply(notGate).measure()).toEqual(0);
    });

    it('should negate the current state of superimposed qubit started with 0', () => {
      const notGate = new Not();
      const qubit = new Qubit(0);
      const hadamard = new Hadamard();
      qubit
        .apply(hadamard)
        .apply(notGate)
        .apply(hadamard);
      const results = [];
      let count = 0;
      while (count < 10) {
        results.push(qubit.measure());
        count++;
      }

      const zeroes = results.filter(r => r === 0);
      const ones = results.filter(r => r === 1);
      expect(zeroes.length).toEqual(0);
      expect(ones.length).toEqual(10);
    });

    it('should negate the current state of superimposed qubit started with 1', () => {
      const notGate = new Not();
      const qubit = new Qubit(1);
      const hadamard = new Hadamard();
      qubit
        .apply(hadamard)
        .apply(notGate)
        .apply(hadamard);
      const results = [];
      let count = 0;
      while (count < 10) {
        results.push(qubit.measure());
        count++;
      }

      const zeroes = results.filter(r => r === 0);
      const ones = results.filter(r => r === 1);
      expect(zeroes.length).toEqual(10);
      expect(ones.length).toEqual(0);
    });
  });

  describe('cnot', () => {
    it('should invalidate cnot of a qubit on itself', () => {
      const aQubit = new Qubit(0);
      expect(() => aQubit.cnot(aQubit)).toThrow(
        'Cnot operation can only be performed on two different qubits.'
      );
    });

    it('should invalidate cnot between a superimposed qubit and a non superimposed qubit', () => {
      const aQubit = new Qubit(0);
      const bQubit = new Qubit(1).apply(new Hadamard());
      expect(() => aQubit.cnot(bQubit)).toThrow(
        'Cannot perform cnot. Results in entanglement.'
      );
    });

    it('should not invert a qubit when control qubit is 0 for absolute qubits', () => {
      expect(new Qubit(0).cnot(new Qubit(0)).measure()).toBe(0);
      expect(new Qubit(1).cnot(new Qubit(0)).measure()).toBe(1);
    });

    it('should invert a qubit when control qubit is 1 for absolute qubits', () => {
      expect(new Qubit(0).cnot(new Qubit(1)).measure()).toBe(1);
      expect(new Qubit(1).cnot(new Qubit(1)).measure()).toBe(0);
    });

    it('should not invert a qubit when control qubit is 0 for superimposed qubits', () => {
      const aSuperImposedQubit = new Qubit(0).apply(new Hadamard());
      const bSuperImposedQubit = new Qubit(0).apply(new Hadamard());

      const results = [];
      aSuperImposedQubit.cnot(bSuperImposedQubit).apply(new Hadamard());
      let counter = 0;
      while (counter < 10) {
        results.push(aSuperImposedQubit.measure());
        counter++;
      }

      const zeroes = results.filter(r => r === 0);
      const ones = results.filter(r => r === 1);
      expect(zeroes.length).toEqual(10);
      expect(ones.length).toEqual(0);
    });

    it('should invert a qubit when control qubit is 1 for superimposed qubits', () => {
      const aSuperImposedQubit = new Qubit(0).apply(new Hadamard());
      const bSuperImposedQubit = new Qubit(1).apply(new Hadamard());

      const results = [];
      aSuperImposedQubit.cnot(bSuperImposedQubit).apply(new Hadamard());
      let counter = 0;
      while (counter < 10) {
        results.push(aSuperImposedQubit.measure());
        counter++;
      }

      const zeroes = results.filter(r => r === 0);
      const ones = results.filter(r => r === 1);
      expect(zeroes.length).toEqual(0);
      expect(ones.length).toEqual(10);
    });
  });
});
