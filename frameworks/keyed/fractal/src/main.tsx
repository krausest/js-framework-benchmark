import { observable, computed, factor, list, Stream, Fractal, Observable, Event, List, Context } from '@fract/core'
import { render } from '@fract/jsx'

// prettier-ignore
const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
// prettier-ignore
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
// prettier-ignore
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']

function rnd(max: number) {
    return Math.round(Math.random() * 1000) % max
}

const Selected = factor<Observable<number>>()

class SelectRowEvent extends Event {
    constructor(readonly row: Row) {
        super()
    }
}

class DeleteRowEvent extends Event {
    constructor(readonly row: Row) {
        super()
    }
}

class Row extends Fractal<JSX.Element> {
    readonly id: number
    readonly label: Observable<string>

    constructor(id: number, label: string) {
        super()
        this.id = id
        this.label = observable(label)
    }

    *stream(ctx: Context) {
        const { id } = this
        const selected = ctx.get(Selected)!
        const className = computed(function* () {
            while (true) {
                yield (yield* selected) === id ? 'danger' : ''
            }
        })
        const selectClickHandler = () => ctx.dispath(new SelectRowEvent(this))
        const deleteClickHandler = () => ctx.dispath(new DeleteRowEvent(this))

        while (true) {
            yield (
                <tr key={id} className={yield* className}>
                    <td className="col-md-1">{id}</td>
                    <td className="col-md-4">
                        <a onClick={selectClickHandler}>{yield* this.label}</a>
                    </td>
                    <td className="col-md-1">
                        <a onClick={deleteClickHandler}>
                            <span className="glyphicon glyphicon-remove" ariaHidden="true"></span>
                        </a>
                    </td>
                    <td className="col-md-6"></td>
                </tr>
            )
        }
    }
}

class Main extends Fractal<JSX.Element> {
    readonly rows = list<Row>([])
    readonly selected = observable<number>(NaN)
    private nextRowId = 1

    private buildRows(count = 1000) {
        var rows = [] as Row[]
        for (var i = 0; i < count; i++) {
            const id = this.nextRowId++
            const label = A[rnd(A.length)] + ' ' + C[rnd(C.length)] + ' ' + N[rnd(N.length)]
            rows.push(new Row(id, label))
        }
        return rows
    }

    delete(row: Row) {
        this.rows.delete(row)
    }

    run() {
        const rows = this.buildRows()
        this.rows.set(rows)
        this.selected.set(NaN)
    }

    add() {
        const rows = this.buildRows(1000)
        this.rows.insert(...rows)
    }

    update() {
        const rows = this.rows.get()

        for (let i = 0; i < rows.length; i += 10) {
            const label = rows[i].label.get()
            rows[i].label.set(label + ' !!!')
        }
    }

    select(row: Row) {
        this.selected.set(row.id)
    }

    runLots() {
        const rows = this.buildRows(10000)
        this.rows.set(rows)
        this.selected.set(NaN)
    }

    clear() {
        this.rows.set([])
        this.selected.set(NaN)
    }

    swapRows() {
        const rows = this.rows.get().slice()

        if (rows.length > 998) {
            ;[rows[1], rows[998]] = [rows[998], rows[1]]
            this.rows.set(rows)
        }
    }

    *stream(ctx: Context) {
        ctx.set(Selected, this.selected)
        ctx.on(SelectRowEvent, (e) => this.select(e.row))
        ctx.on(DeleteRowEvent, (e) => this.delete(e.row))

        const runHandler = () => this.run()
        const runLotsHandler = () => this.runLots()
        const addHandler = () => this.add()
        const updateHandler = () => this.update()
        const clearHandler = () => this.clear()
        const swapRowsHandler = () => this.swapRows()

        while (true) {
            yield (
                <div className="container">
                    <div className="jumbotron">
                        <div className="row">
                            <div className="col-md-6">
                                <h1>fractal</h1>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="run"
                                            onClick={runHandler}
                                        >
                                            Create 1,000 rows
                                        </button>
                                    </div>
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="runlots"
                                            onClick={runLotsHandler}
                                        >
                                            Create 10,000 rows
                                        </button>
                                    </div>
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="add"
                                            onClick={addHandler}
                                        >
                                            Append 1,000 rows
                                        </button>
                                    </div>
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="update"
                                            onClick={updateHandler}
                                        >
                                            Update every 10th row
                                        </button>
                                    </div>
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="clear"
                                            onClick={clearHandler}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                    <div className="col-sm-6 smallpad">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            id="swaprows"
                                            onClick={swapRowsHandler}
                                        >
                                            Swap Rows
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="table table-hover table-striped test-data">
                        <tbody>{yield* connect(this.rows)}</tbody>
                    </table>
                    <span className="preloadicon glyphicon glyphicon-remove" ariaHidden="true" />
                </div>
            )
        }
    }
}

function* connect<T>(list: List<Stream<T>>) {
    const acc = [] as T[]

    for (const item of yield* list) {
        acc.push(yield* item)
    }

    return acc
}

render(new Main(), document.getElementById('main')!)
