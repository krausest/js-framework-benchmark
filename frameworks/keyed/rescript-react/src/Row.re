let glyph_icon =
  <span className="glyphicon glyphicon-remove" ariaHidden=true />;

[@react.component]
let make =
  React.memo((~onSelect, ~onRemove, ~selected, ~item: Util.item) =>
    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">
        {item.id |> string_of_int |> React.string}
      </td>
      <td className="col-md-4">
        <a onClick={_ => onSelect(item)}>
          {item.label |> React.string}
        </a>
      </td>
      <td className="col-md-1">
        <a onClick={_ => onRemove(item)}> glyph_icon </a>
      </td>
      <td className="col-md-6" />
    </tr>
  );