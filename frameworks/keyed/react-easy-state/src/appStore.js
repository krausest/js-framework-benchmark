import { store } from 'react-easy-state'
import randomSentence from './randomSentence'

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
    appStore.rows = []
    appStore.buildRows(1000)
  },
  add () {
    appStore.buildRows(1000)
  },
  update () {
    for (let i = 0; i < appStore.rows.length; i += 10) {
      appStore.rows[i].label += ' !!!'
    }
  },
  select (row) {
    appStore.deselectAll()
    appStore.selectedRow = row
    row.selected = true
  },
  delete (row) {
    appStore.rows.splice(appStore.rows.indexOf(row), 1)
  },
  runLots () {
    appStore.rows = []
    appStore.buildRows(10000)
  },
  clear() {
    appStore.rows = []
  },
  swapRows() {
    if (appStore.rows.length > 998) {
      const temp = appStore.rows[1]
      appStore.rows[1] = appStore.rows[998]
      appStore.rows[998] = temp
    }
  }
})

export default appStore
