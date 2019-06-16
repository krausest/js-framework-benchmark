'use strict';

import { combineReducers, createStore } from 'redux';
import { node, demux } from 'redux-combiner'
import * as utils from './utils'

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

const reducer = node({

  store: {

    data: demux(
        [],
        {
          label: node('')
            .on(UPDATE, label => label + ' !!!')
        },
        utils.every10th
      )
      .on(DELETE, (data, { id }) => utils.deleteRow(data, id))
      .on(RUN, utils.run)
      .on(ADD, utils.add)
      .on(CLEAR, [])
      .on(RUN_LOTS, utils.runLots)
      .on(SWAP_ROWS, utils.swapRows),

    selected: node(false)
      .on(SELECT, (_, { id }) => id)
      .on([ RUN, RUN_LOTS, CLEAR ], undefined)

  }
})

export default createStore(reducer)
