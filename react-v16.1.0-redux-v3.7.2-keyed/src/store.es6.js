'use strict';

import { combineReducers, createStore } from 'redux';
import { fromJS } from 'immutable';

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

const BUILD_DATA = 'BUILD_DATA';
const DELETE = 'DELETE';
const RUN = 'RUN';
const ADD = 'ADD';
const UPDATE = 'UPDATE';
const SELECT = 'SELECT';
const RUN_LOTS = 'RUN_LOTS';
const CLEAR = 'CLEAR';
const SWAP_ROWS = 'SWAP_ROWS';

export function buildData() {
  return {
    type: BUILD_DATA
  };
}

export function remove(id) {
  return {
    type: DELETE,
    id
  };
}

export function run() {
  return {
    type: RUN
  };
}

export function add() {
  return {
    type: ADD
  };
}

export function update() {
  return {
    type: UPDATE
  }
}

export function select(id) {
  return {
    type: SELECT,
    id
  };
}

export function runLots() {
  return {
    type: RUN_LOTS
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}

export function swapRows() {
  return {
    type: SWAP_ROWS
  }
}

var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

var initialState = fromJS({
  data: [],
  selected: false,
});

let id = 1;

function buildData(count = 1000) {
  let output = fromJS([]);
  new Array(count).fill(' ').forEach(() => {
    output = output.push(fromJS({
      id: id++,
      label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
    }));
  });
  return output;
}

function dataStore(state = initialState, action) {
  switch (action.type) {
    case DELETE:
      const index = state.get('data').findIndex(item => item.get('id') === action.id);
      return state.set('data', state.get('data').delete(index));
    case RUN:
      return state.withMutations(original => {
        original.set('data', buildData(1000));
        original.set('selected', undefined);
      });
    case ADD:
      return state.set('data', state.get('data').concat(buildData(1000)));;
    case UPDATE:
      return state.withMutations(original => {
        const length = original.get('data').size;
        for (let i=0;i<length;i+=10) {
          const label = original.getIn(['data', i, 'label']);
          original.setIn(['data', i, 'label'], `${label} !!!`);
        }
      });
    case SELECT:
      return state.set('selected', action.id);
    case RUN_LOTS:
      return state.withMutations(original => {
        original.set('data', buildData(10000));
        original.set('selected', undefined);
      });
    case CLEAR:
      return state.withMutations(original => {
        original.set('data', original.get('data').clear());
        original.set('selected', undefined);
      })
    case SWAP_ROWS:
      return state.withMutations(original => {
        const a = original.getIn(['data', 1]);
        original.setIn(['data', 1], original.getIn(['data', 998]));
        original.setIn(['data', 998], a);
      });
    default:
      return state;
  }
}

export default createStore(combineReducers({
  store: dataStore
}))
