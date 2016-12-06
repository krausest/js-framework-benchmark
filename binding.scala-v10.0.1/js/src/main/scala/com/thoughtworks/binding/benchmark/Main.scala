package com.thoughtworks.binding
package benchmark

import org.scalajs.dom._

/**
  * @author 杨博 (Yang Bo) &lt;pop.atry@gmail.com&gt;
  */
object Main extends scalajs.js.JSApp {

  @dom def render(store: Store) = <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Binding.scala v10.0.0</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="run" onclick={_: Event => store.run()}>Create 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="runlots" onclick={_: Event => store.runLots()}>Create 10,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="add" onclick={_: Event => store.add()}>Append 1,000 rows</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="update" onclick={_: Event => store.update()}>Update every 10th row</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="clear" onclick={_: Event => store.clear()}>Clear</button>
            </div>
            <div class="col-sm-6 smallpad">
              <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={_: Event => store.swapRows()}>Swap Rows</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>{
        for (row <- store.data) yield {
          <tr class={store.selected.bind match { case Some(`row`) => "danger" case _ => "" }}><td class="col-md-1">{row.id.bind.toString}</td><td class="col-md-4"><a onclick={_: Any => store.select(row)}>{row.label.bind}</a></td><td class="col-md-1"><a onclick={_: Any => store.delete(row)}><span class="glyphicon glyphicon-remove" data:aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>
        }
      }</tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" data:aria-hidden="true"></span>
  </div>

  override def main(): Unit = {
    dom.render(document.body, render(new Store))
  }

}
