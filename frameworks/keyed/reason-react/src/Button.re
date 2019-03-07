let component = ReasonReact.statelessComponent("Button");

let make = (~id, ~title, ~cb, _children) => {
  ...component,
  render: _self =>
    <div className="col-sm-6 smallpad">
      <button type_="button" className="btn btn-primary btn-block" id onClick=cb>
        {title |> ReasonReact.string}
      </button>
    </div>,
};
