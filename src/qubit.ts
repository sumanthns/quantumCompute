export default class Qubit {
  private internalState: number[];
  private valueHistory: number[] = [];
  constructor(type: number) {
    if (type === 0) {
      this.internalState = [1, 0];
    } else if (type === 1) {
      this.internalState = [0, 1];
    } else {
      throw new Error(
        'Sigh... Stuck in 4 dimensional quantum world. I pity you mortal 🖖'
      );
    }
  }

  public show() {
    if (this.internalState[0] === 1) {
      return 0;
    } else if (this.internalState[0] === 0) {
      return 1;
    } else {
      const zeroProbability = Math.pow(this.internalState[0], 2);
      let value;
      if (this.valueHistory.length === 0) {
        value = zeroProbability > 0.5 ? 0 : 1;
      } else {
        const numberOfZeroes = this.valueHistory.filter(val => val === 0)
          .length;
        value =
          numberOfZeroes / this.valueHistory.length <= zeroProbability ? 0 : 1;
      }
      this.valueHistory.push(value);
      return value;
    }
  }
}
