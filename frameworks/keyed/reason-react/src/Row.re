let glyph_icon =
  <span className="glyphicon glyphicon-remove" ariaHidden=true />;

let makeProps = (~key as _, ~onSelect, ~onRemove, ~selected, ~item, ()) => {
  "onSelect": onSelect,
  "onRemove": onRemove,
  "selected": selected,
  "item": item,
};

[@react.component]
let impl = (~onSelect, ~onRemove, ~selected, ~item: Util.item) =>
  <tr className={selected ? "danger" : ""}>
    <td className="col-md-1">
      {item.id |> string_of_int |> ReasonReact.string}
    </td>
    <td className="col-md-4">
      <a onClick={_ => onSelect(item)}>
        {item.label |> ReasonReact.string}
      </a>
    </td>
    <td className="col-md-1">
      <a onClick={_ => onRemove(item)}> glyph_icon </a>
    </td>
    <td className="col-md-6" />
  </tr>;

let make = React.memo(impl);