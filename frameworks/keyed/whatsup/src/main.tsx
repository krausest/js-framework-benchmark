import { render, Context } from 'whatsup/jsx'
import { RowData, Store } from './store'

function* Main(this: Context) {
    const store = new Store()

    this.share(store)

    const runHandler = () => store.run()
    const runLotsHandler = () => store.runLots()
    const addHandler = () => store.add()
    const updateHandler = () => store.update()
    const clearHandler = () => store.clear()
    const swapRowsHandler = () => store.swapRows()

    while (true) {
        yield (
            <div className="container">
                <div className="jumbotron">
                    <div className="row">
                        <div className="col-md-6">
                            <h1>WhatsUp</h1>
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
                <Table />
                <span className="preloadicon glyphicon glyphicon-remove" ariaHidden="true" />
            </div>
        )
    }
}

function* Table(this: Context) {
    const store = this.find(Store)

    while (true) {
        yield (
            <table className="table table-hover table-striped test-data">
                <tbody>
                    {store.rows.map((row) => (
                        <Row data={row} key={row.id} />
                    ))}
                </tbody>
            </table>
        )
    }
}

interface RowProps {
    data: RowData
}

function* Row(this: Context, props: RowProps) {
    const store = this.find(Store)

    while (true) {
        const { data } = props
        const { id, label, selected } = data
        const className = selected ? 'danger' : ''

        yield (
            <tr className={className}>
                <td className="col-md-1">{id}</td>
                <td className="col-md-4">
                    <a onClick={() => store.select(data)}>{label}</a>
                </td>
                <td className="col-md-1">
                    <a onClick={() => store.delete(data)}>
                        <span className="glyphicon glyphicon-remove" ariaHidden="true"></span>
                    </a>
                </td>
                <td className="col-md-6"></td>
            </tr>
        )
    }
}

render(<Main />, document.getElementById('main')!)
