import Qubit from '../qubit';
import Hadamard from '../gates/hadamard';

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
        results.push(qubit.show());
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
          results.push(qubit.show());
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
});
