import { easyStore } from 'react-easy-state/dist/esm.es6'
import randomSentence from './randomSentence'
import { startMeasure, stopMeasure } from './logPerf'

let idCounter = 1

export default easyStore({
  rows: [],
  deselectAll () {
    if (this.selectedRow) {
      this.selectedRow.selected = false
      this.selectedRow = undefined
    }
  },
  buildRows (numOfRows) {
    for (let i = 0; i < numOfRows; i++) {
      this.rows.push({ id: idCounter++, label: randomSentence() })
    }
    this.deselectAll()
  },
  run () {
    startMeasure('run')
    this.rows = []
    this.buildRows(1000)
    stopMeasure('run')
  },
  add () {
    startMeasure('add')
    this.buildRows(1000)
    stopMeasure('add')
  },
  update () {
    startMeasure('update')
    for (let i = 0; i < this.rows.length; i += 10) {
      this.rows[i].label += ' !!!'
    }
    stopMeasure('update')
  },
  select (row) {
    startMeasure('select')
    this.deselectAll()
    this.selectedRow = row
    row.selected = true
    stopMeasure('select')
  },
  delete (row) {
    startMeasure('delete')
    this.rows.splice(this.rows.indexOf(row), 1)
    stopMeasure('delete')
  },
  runLots () {
    startMeasure('runLots')
    this.rows = []
    this.buildRows(10000)
    stopMeasure('runLots')
  },
  clear() {
    startMeasure('clear')
    this.rows = []
    startMeasure('clear')
  },
  swapRows() {
    startMeasure('swapRows')
    if (this.rows.length > 10) {
      const temp = this.rows[4]
      this.rows[4] = this.rows[9]
      this.rows[9] = temp
    }
    stopMeasure('swapRows')
  }
})
