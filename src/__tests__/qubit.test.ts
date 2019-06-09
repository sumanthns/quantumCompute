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

    it(' 0 => hadamard => not => hadamard should be 0', () => {
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
      expect(zeroes.length).toEqual(10);
      expect(ones.length).toEqual(0);
    });

    it('1 => hadamard => not => hadamard should be 1', () => {
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
      expect(zeroes.length).toEqual(0);
      expect(ones.length).toEqual(10);
    });
  });

  describe('cnot', () => {
    it('should invalidate cnot of a qubit on itself', () => {
      const aQubit = new Qubit(0);
      expect(() => aQubit.cnot(aQubit)).toThrow(
        'Cnot operation can only be performed on two different qubits.'
      );
    });

    it('should invert applied qubit when original qubit is absolute 1', () => {
      const qubit = new Qubit(1);
      const appliedQubit = new Qubit(0);
      const anotherAppliedQubit = new Qubit(1);
      qubit.cnot(appliedQubit);
      qubit.cnot(anotherAppliedQubit);

      // should invert appliedQubit and anotherAppliedQubit
      expect(appliedQubit.measure()).toBe(1);
      expect(anotherAppliedQubit.measure()).toBe(0);
    });

    it('should not invert applied qubit when original qubit is absolute 1', () => {
      const qubit = new Qubit(0);
      const appliedQubit = new Qubit(0);
      const anotherAppliedQubit = new Qubit(1);
      qubit.cnot(appliedQubit);
      qubit.cnot(anotherAppliedQubit);

      // should not invert appliedQubit and anotherAppliedQubit
      expect(appliedQubit.measure()).toBe(0);
      expect(anotherAppliedQubit.measure()).toBe(1);
    });

    it('should invert a original superimposed 0 qubit when superimposed 1 is applied', () => {
      const originalQubit = new Qubit(0).apply(new Hadamard());
      const appliedQubit = new Qubit(1).apply(new Hadamard());
      originalQubit.cnot(appliedQubit);

      // should invert originalQubit
      expect(originalQubit.apply(new Hadamard()).measure()).toBe(1);
      expect(appliedQubit.apply(new Hadamard()).measure()).toBe(1);
    });

    it('should invert a original superimposed 1 qubit when superimposed 1 is applied', () => {
      const originalQubit = new Qubit(1).apply(new Hadamard());
      const appliedQubit = new Qubit(1).apply(new Hadamard());
      originalQubit.cnot(appliedQubit);

      // should invert originalQubit
      expect(originalQubit.apply(new Hadamard()).measure()).toBe(0);
      expect(appliedQubit.apply(new Hadamard()).measure()).toBe(1);
    });

    it('should not invert a original superimposed 0 qubit when superimposed 0 is applied', () => {
      const originalQubit = new Qubit(0).apply(new Hadamard());
      const appliedQubit = new Qubit(0).apply(new Hadamard());
      originalQubit.cnot(appliedQubit);

      // should not invert originalQubit
      expect(originalQubit.apply(new Hadamard()).measure()).toBe(0);
      expect(appliedQubit.apply(new Hadamard()).measure()).toBe(0);
    });

    it('should not invert a original superimposed 1 qubit when superimposed 0 is applied', () => {
      const originalQubit = new Qubit(1).apply(new Hadamard());
      const appliedQubit = new Qubit(0).apply(new Hadamard());
      originalQubit.cnot(appliedQubit);

      // should not invert originalQubit
      expect(originalQubit.apply(new Hadamard()).measure()).toBe(1);
      expect(appliedQubit.apply(new Hadamard()).measure()).toBe(0);
    });
  });

  describe('entanglement', () => {
    it('should create equal entanglement between a superposed qubit 0 and an absolute qubit 0 on cnot', () => {
      //expect 50% probability of both qubit being 11 or 00, but not 10 or 01
      let counter = 0;

      while (counter < 10) {
        const qubitOne = new Qubit(0);
        const qubitTwo = new Qubit(0);

        qubitOne.apply(new Hadamard()).cnot(qubitTwo);
        expect(qubitOne.measure()).toBe(qubitTwo.measure());
        counter++;
      }
    });

    it('should create equal entanglement between a superposed qubit 1 and an absolute qubit 0 on cnot', () => {
      //expect 50% probability of both qubit being 11 or 00, but not 10 or 01
      let counter = 0;

      while (counter < 10) {
        const qubitOne = new Qubit(1);
        const qubitTwo = new Qubit(0);

        qubitOne.apply(new Hadamard()).cnot(qubitTwo);
        expect(qubitOne.measure()).toBe(qubitTwo.measure());
        counter++;
      }
    });

    it('should create opposite entanglement between a superposed qubit 0 and an absolute qubit 1 on cnot', () => {
      //expect 50% probability of both qubit being 10 or 01, but not 00 or 11
      let counter = 0;

      while (counter < 10) {
        const qubitOne = new Qubit(0);
        const qubitTwo = new Qubit(1);

        qubitOne.apply(new Hadamard()).cnot(qubitTwo);
        expect(qubitOne.measure()).not.toBe(qubitTwo.measure());
        counter++;
      }
    });

    it('should create opposite entanglement between a superposed qubit 1 and an absolute qubit 1 on cnot', () => {
      //expect 50% probability of both qubit being 10 or 01, but not 00 or 11
      let counter = 0;

      while (counter < 10) {
        const qubitOne = new Qubit(1);
        const qubitTwo = new Qubit(1);

        qubitOne.apply(new Hadamard()).cnot(qubitTwo);
        expect(qubitOne.measure()).not.toBe(qubitTwo.measure());
        counter++;
      }
    });
  });
});
