open Incr_dom;
open Elements;

let createElement = (~id, ~title, ~onClick, ~children as _, _) => {
  <div className="col-sm-6 smallpad">
    <button className="btn btn-primary btn-block" id onClick>
      {Vdom.Node.text(title)}
    </button>
  </div>
};
