open Incr_dom;
open Elements;

let hdr = Vdom.Node.text("Incr_dom");

let createElement =
    (~run, ~runLots, ~add, ~update, ~clear, ~swapRows, ~children as _, _) => {
  <div className="jumbotron">
    <div className="row">
      <div className="col-md-6"> <h1> hdr </h1> </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1,000 rows" onClick=run />
          <Button id="runlots" title="Create 10,000 rows" onClick=runLots />
          <Button id="add" title="Append 1,000 rows" onClick=add />
          <Button id="update" title="Update every 10th row" onClick=update />
          <Button id="clear" title="Clear" onClick=clear />
          <Button id="swaprows" title="Swap Rows" onClick=swapRows />
        </div>
      </div>
    </div>
  </div>;
};
