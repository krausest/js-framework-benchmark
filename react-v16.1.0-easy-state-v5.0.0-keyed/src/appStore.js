import { store } from 'react-easy-state'
import randomSentence from './randomSentence'
import { startMeasure, stopMeasure } from './logPerf'

let idCounter = 1

const appStore = store({
  rows: [],
  deselectAll () {
    if (appStore.selectedRow) {
      appStore.selectedRow.selected = false
      appStore.selectedRow = undefined
    }
  },
  buildRows (numOfRows) {
    for (let i = 0; i < numOfRows; i++) {
      appStore.rows.push({ id: idCounter++, label: randomSentence() })
    }
    appStore.deselectAll()
  },
  run () {
    startMeasure('run')
    appStore.rows = []
    appStore.buildRows(1000)
    stopMeasure('run')
  },
  add () {
    startMeasure('add')
    appStore.buildRows(1000)
    stopMeasure('add')
  },
  update () {
    startMeasure('update')
    for (let i = 0; i < appStore.rows.length; i += 10) {
      appStore.rows[i].label += ' !!!'
    }
    stopMeasure('update')
  },
  select (row) {
    startMeasure('select')
    appStore.deselectAll()
    appStore.selectedRow = row
    row.selected = true
    stopMeasure('select')
  },
  delete (row) {
    startMeasure('delete')
    appStore.rows.splice(appStore.rows.indexOf(row), 1)
    stopMeasure('delete')
  },
  runLots () {
    startMeasure('runLots')
    appStore.rows = []
    appStore.buildRows(10000)
    stopMeasure('runLots')
  },
  clear() {
    startMeasure('clear')
    appStore.rows = []
    startMeasure('clear')
  },
  swapRows() {
    startMeasure('swapRows')
    if (appStore.rows.length > 998) {
      const temp = appStore.rows[1]
      appStore.rows[1] = appStore.rows[998]
      appStore.rows[998] = temp
    }
    stopMeasure('swapRows')
  }
})

export default appStore
