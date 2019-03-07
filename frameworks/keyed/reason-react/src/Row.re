type retained_props_t = {
  item: Util.item,
  selected: bool,
};

type actions_t =
  | SELECT_CHANGE;

let component = ReasonReact.reducerComponent("Row");

let glyph_icon =
  <span className="glyphicon glyphicon-remove" ariaHidden=true />;

let make = (~onSelect, ~onRemove, ~selected, ~item: Util.item, _children) => {
  ...component,
  initialState: () => {item, selected: false},

  reducer: (_action: actions_t, state: retained_props_t) => {
    ReasonReact.Update({...state, selected: !state.selected});
  },

  render: self => {
    if (selected != self.state.selected) {
      self.send(SELECT_CHANGE);
    };

    <tr className={selected ? "danger" : ""}>
      <td className="col-md-1">
        {item.id |> string_of_int |> ReasonReact.string}
      </td>
      <td className="col-md-4">
        <a onClick=onSelect> {item.label |> ReasonReact.string} </a>
      </td>
      <td className="col-md-1"> <a onClick=onRemove> glyph_icon </a> </td>
      <td className="col-md-6" />
    </tr>;
  },

  shouldUpdate: ({oldSelf}) =>
    oldSelf.state.selected !== selected || oldSelf.state.item !== item,
};
