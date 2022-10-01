import { action, array, computed, observable } from 'whatsup'

// prettier-ignore
const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
// prettier-ignore
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
// prettier-ignore
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

function rnd(max: number) {
    return Math.round(Math.random() * 1000) % max
}

export class RowData {
    readonly store: Store
    readonly id: number

    @observable
    label: string

    @computed
    get selected() {
        return this.store.selected === this.id
    }

    constructor(store: Store, id: number, label: string) {
        this.store = store
        this.id = id
        this.label = label
    }
}

export class Store {
    @observable
    rows = array<RowData>()

    @observable
    selected = NaN

    private nextRowId = 1

    buildRows(count: number) {
        const rows = [] as RowData[]

        for (var i = 0; i < count; i++) {
            const id = this.nextRowId++
            const label = A[rnd(A.length)] + ' ' + C[rnd(C.length)] + ' ' + N[rnd(N.length)]
            rows.push(new RowData(this, id, label))
        }

        return rows
    }

    @action
    delete(row: RowData) {
        const index = this.rows.indexOf(row)

        this.rows.splice(index, 1)
    }

    @action
    run() {
        const rows = this.buildRows(1000)

        this.rows = array(rows)
        this.selected = NaN
    }

    @action
    runLots() {
        const rows = this.buildRows(10000)

        this.rows = array(rows)
        this.selected = NaN
    }

    @action
    add() {
        const rows = this.buildRows(1000)

        this.rows.push(...rows)
    }

    @action
    update() {
        const { length } = this.rows

        for (let i = 0; i < length; i += 10) {
            this.rows[i].label += ' !!!'
        }
    }

    @action
    select(row: RowData) {
        this.selected = row.id
    }

    @action
    clear() {
        this.rows = array()
        this.selected = NaN
    }

    @action
    swapRows() {
        const { rows } = this

        if (rows.length > 998) {
            ;[rows[1], rows[998]] = [rows[998], rows[1]]
        }
    }
}
