[@react.component]
let make = (~run, ~runLots, ~add, ~update, ~clear, ~swapRows) => {
  let hdr = ReasonReact.string("Reason-React keyed");

  <div className="jumbotron">
    <div className="row">
      <div className="col-md-6"> <h1> hdr </h1> </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1,000 rows" cb=run />
          <Button id="runlots" title="Create 10,000 rows" cb=runLots />
          <Button id="add" title="Append 1,000 rows" cb=add />
          <Button id="update" title="Update every 10th row" cb=update />
          <Button id="clear" title="Clear" cb=clear />
          <Button id="swaprows" title="Swap Rows" cb=swapRows />
        </div>
      </div>
    </div>
  </div>;
};