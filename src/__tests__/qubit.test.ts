import Qubit from '../qubit';

describe('qubit', () => {
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
