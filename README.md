# quantumCompute

Quantum computation simulator

## Qubit

A [qubit](https://en.wikipedia.org/wiki/Qubit) represents a quantum bit which is the basic unit of computation.

A qubit is represented in array notation as [a, b],
where `a^2` is the probability of finding the qubit in 0 state
and `b^2` is the probability of finding the qubit in 1 state.

It can be created initially in 0 or 1 state.

In array notation,

```
0 state: [1, 0]
1 state: [0, 1]
```

When `measure` method is called on a qubit, it collapses into either 0 or 1 based on its internal probability distribution.
