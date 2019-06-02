import { isEqual } from 'lodash';

const BlockCircle = [
  {
    state: [1, 0],
    actions: [
      {
        type: '50H',
        nextState: [Math.sqrt(0.5), Math.sqrt(0.5)]
      },
      {
        type: 'NOT',
        nextState: [0, 1]
      }
    ]
  },
  {
    state: [0, 1],
    actions: [
      {
        type: '50H',
        nextState: [Math.sqrt(0.5), -Math.sqrt(0.5)]
      },
      {
        type: 'NOT',
        nextState: [1, 0]
      }
    ]
  },
  {
    state: [Math.sqrt(0.5), -Math.sqrt(0.5)],
    actions: [
      {
        type: '50H',
        nextState: [0, 1]
      },
      {
        type: 'not',
        nextState: [-Math.sqrt(0.5), Math.sqrt(0.5)]
      }
    ]
  },
  {
    state: [Math.sqrt(0.5), Math.sqrt(0.5)],
    actions: [
      {
        type: '50H',
        nextState: [1, 0]
      },
      {
        type: 'not',
        nextState: [Math.sqrt(0.5), Math.sqrt(0.5)]
      }
    ]
  }
];

const lookUp = (currentState: number[], actionType: string) => {
  const blochEntry = BlockCircle.find(entry =>
    isEqual(entry.state, currentState)
  );
  if (typeof blochEntry === 'undefined') {
    throw new Error(`invalid state, ${currentState}`);
  }
  const action = blochEntry.actions.find(action => action.type === actionType);

  if (typeof action === 'undefined') {
    throw new Error('Invalid action');
  }

  return action.nextState;
};

export default lookUp;
