[@react.component]
let make = (~id, ~title, ~cb) => {
  <div className="col-sm-6 smallpad">
    <button type_="button" className="btn btn-primary btn-block" id onClick=cb>
      {title |> React.string}
    </button>
  </div>;
};