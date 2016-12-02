package com.thoughtworks.binding
package benchmark

import org.scalajs.dom._

/**
  * @author 杨博 (Yang Bo) &lt;pop.atry@gmail.com&gt;
  */
object Main extends scalajs.js.JSApp {

  @dom def render(store: Store) = <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>Binding.scala v10.0.0</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="run" onclick={_: Event => store.run()}>Create 1,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="runlots" onclick={_: Event => store.runLots()}>Create 10,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="add" onclick={_: Event => store.add()}>Append 1,000 rows</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="update" onclick={_: Event => store.update()}>Update every 10th row</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="clear" onclick={_: Event => store.clear()}>Clear</button>
            </div>
            <div className="col-sm-6 smallpad">
              <button type="button" className="btn btn-primary btn-block" id="swaprows" onclick={_: Event => store.swapRows()}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <tbody>{
        for ((id, label) <- store.data.bind) yield {
          <tr className={store.selected.bind match { case Some(`id`) => "danger" case _ => "" }}><td className="col-md-1">{id.toString}</td><td className="col-md-4"><a onclick={_: Any => store.select(id)}>{label}</a></td><td className="col-md-1"><a onclick={_: Any => store.delete(id)}><span className="glyphicon glyphicon-remove" data:aria-hidden="true"></span></a></td><td className="col-md-6"></td></tr>
        }
      }</tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" data:aria-hidden="true"></span>
  </div>

  override def main(): Unit = {
    dom.render(document.body, render(new Store))
  }

}
