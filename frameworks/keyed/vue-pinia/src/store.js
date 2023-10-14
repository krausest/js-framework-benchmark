import { defineStore } from 'pinia'
import { buildData } from './data'

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    selected: undefined,
    rows: [],
  }),
  actions: {
    setRows(update) {
      this.rows = update
    },
    add() {
      this.rows = this.rows.concat(buildData(1000))
    },
    remove(id) {
      const index = this.rows.findIndex((d) => d.id === id)
      if (index > -1) {
        this.rows.splice(index, 1)
      }
    },
    select(id) {
      this.selected = id
    },
    run() {
      this.setRows(buildData())
      this.selected = undefined
    },
    update() {
      for (let i = 0; i < this.rows.length; i += 10) {
        this.rows[i].label += ' !!!'
      }
    },
    runLots() {
      this.setRows(buildData(10000))
      this.selected = undefined
    },
    clear() {
      this.setRows([])
      this.selected = undefined
    },
    swapRows() {
      if (this.rows.length > 998) {
        const d1 = this.rows[1]
        const d998 = this.rows[998]
        this.rows[1] = d998
        this.rows[998] = d1
      }
    },
  },
})