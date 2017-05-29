import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import easyState from 'react-easy-state'
import Row from './Row'
import randomSentence from './randomSentence'
import {startMeasure, stopMeasure} from './logPerf'

let idCounter = 1

@easyState
class Main extends Component {
  constructor (props) {
    super(props)
    this.state = { rows: [] }
  }

  componentDidUpdate() {
    stopMeasure()
  }

  componentDidMount() {
    stopMeasure()
  }

  buildRows (numOfRows) {
    const { state } = this
    for (let i = 0; i < numOfRows; i++) {
      state.rows.push({ id: idCounter++, label: randomSentence() })
    }
  }

  run () {
    startMeasure('run')
    const { state } = this
    state.rows = []
    state.selected = undefined
    this.buildRows(1000)
  }

  add () {
    startMeasure('add')
    this.buildRows(1000)
  }

  update () {
    startMeasure('update')
    const { rows } = this.state
    for (let i = 0; i < rows.length; i += 10) {
      rows[i].label += ' !!!'
    }
  }

  select (row) {
    startMeasure('select')
    const { state } = this
    state.selected = row
  }

  delete (row) {
    startMeasure('delete')
    const { rows } = this.state
    rows.splice(rows.indexOf(row), 1)
  }

  runLots () {
    startMeasure('runLots')
    const { state } = this
    state.rows = []
    state.selected = undefined
    this.buildRows(10000)
  }

  clear() {
    startMeasure('clear')
    const { state } = this
    state.rows = []
    state.selected = undefined
  }

  swapRows() {
    startMeasure('swapRows')
    const { rows } = this.state
    if (rows.length > 10) {
      const temp = rows[4]
      rows[4] = rows[9]
      rows[9] = temp
    }
  }

  render() {
    const { rows, selected } = this.state

    return (
      <div className="container">
        <div className="jumbotron">
          <div className="row">
            <div className="col-md-6">
              <h1>React v15.5.4 + Easy State 1.0.3</h1>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="run" onClick={this.run}>Create 1,000 rows</button>
                </div>
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={this.runLots}>Create 10,000 rows</button>
                </div>
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="add" onClick={this.add}>Append 1,000 rows</button>
                </div>
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="update" onClick={this.update}>Update every 10th row</button>
                </div>
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="clear" onClick={this.clear}>Clear</button>
                </div>
                <div className="col-sm-6 smallpad">
                  <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={this.swapRows}>Swap Rows</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-hover table-striped test-data">
          <tbody>
            {rows.map(row =>
              <Row onClick={this.select} onDelete={this.delete}
                key={row.id} row={row} styleClass={row === selected ? 'danger' : ''}></Row>)}
          </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'))
