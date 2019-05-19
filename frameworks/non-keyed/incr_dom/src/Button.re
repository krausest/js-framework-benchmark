open Incr_dom;
open Elements;

let createElement = (~id, ~title, ~onClick, ~children as _, _) => {
  <div className="col-sm-6 smallpad">
    <button className="btn btn-primary btn-block" id onClick>
      {Vdom.Node.text(title)}
    </button>
  </div>
};

/*
-let component = ReasonReact.statelessComponent("Button");
-
-let make = (~id, ~title, ~cb, _children) => {
-  ...component,
-  render: _self =>
-    <div className="col-sm-6 smallpad">
-      <button type_="button" className="btn btn-primary btn-block" id onClick=cb>
-        {title |> ReasonReact.string}
-      </button>
-    </div>,
-};
*/
