open! Core_kernel;
open Incr_dom;
open Elements;

open Util;

let glyph_icon =
  <span className="glyphicon glyphicon-remove" ariaHidden=true />;

let createElement =
    (~onSelect, ~onRemove, ~selected, ~item, ~children as _, _) => {
  <tr className={selected ? "danger" : ""}>
    <td className="col-md-1">
      {item.id |> string_of_int |> Vdom.Node.text}
    </td>
    <td className="col-md-4">
      <a onClick=onSelect> {item.label |> Vdom.Node.text} </a>
    </td>
    <td className="col-md-1"> <a onClick=onRemove> glyph_icon </a> </td>
    <td className="col-md-6" />
  </tr>;
};
