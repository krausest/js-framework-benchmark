'use strict';

const nx = require('@nx-js/framework')
const randomSentence = require('./randomSentence')
const timer = require('./timer')

let id = 1

// the app component uses all of the core nx middlewares by default
// it can be instantiated with <perf-app></perf-app> in HTML
nx.components.app()
  .use(setup)
  .register('perf-app')

// the performance sensitive component uses the required middlewares only
// it can be instantiated with <tr is="perf-row"></tr> in HTML
nx.component({element: 'tr', state: false, isolate: 'middlewares'})
  .useOnContent(nx.middlewares.observe)
  .useOnContent(nx.middlewares.interpolate)
  .useOnContent(nx.middlewares.events)
  .use(nx.middlewares.attributes)
  .use(nx.middlewares.style)
  .register('perf-row')

// this is a custom middleware to setup the state for the app component
function setup (elem, state) {
    state.rows = []

    state.add = function add () {
        timer.startMeasure('add')
        for (var i = 0; i < 1000; i++) {
          state.rows.push({ id: id++, label: randomSentence() })
        }
        timer.stopMeasure()
    }

    state.remove = function remove (item) {
        timer.startMeasure('remove')
        const index = state.rows.indexOf(item)
        state.rows.splice(index, 1)
        timer.stopMeasure()
    }

    state.select = function select (item) {
        timer.startMeasure('select')
        state.selected = item
        timer.stopMeasure()
    }

    state.run = function run () {
      timer.startMeasure('add')
      state.rows = []
      for (var i = 0; i < 1000; i++) {
        state.rows.push({ id: id++, label: randomSentence() })
      }
      timer.stopMeasure()
    }

    state.update = function update () {
        timer.startMeasure('update')
        for (let i = 0; i < state.rows.length; i++) {
          if (i % 10 === 0) state.rows[i].label += ' !!!'
        }
        timer.stopMeasure()
    }

    state.runLots = function runLots () {
      timer.startMeasure('add')
      state.rows = []
      for (var i = 0; i < 10000; i++) {
        state.rows.push({ id: id++, label: randomSentence() })
      }
      timer.stopMeasure()
    }

    state.clear = function clear () {
        timer.startMeasure('clear')
        state.rows = []
        timer.stopMeasure()
    }

    state.swapRows = function swapRows () {
        timer.startMeasure('swapRows')
        if (10 < state.rows.length) {
          const item4 = state.rows[4]
          const item9 = state.rows[9]
          state.rows[4] = item9
          state.rows[9] = item4
        }
        timer.stopMeasure()
    }

    state.track = function track (item1, item2) {
      return (item2 !== undefined)
    }
}
