export const shuffle = (array: number[]) => {
  array.sort(() => Math.random() - 0.5);
};

export const getRandomInt = (max: number) =>
  Math.floor(Math.random() * Math.floor(max));
