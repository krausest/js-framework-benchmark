open! Core_kernel;
open Incr_dom;
open Elements;

open Util;

/*
module Model = {
  [@deriving (sexp, fields, compare)]
  type t = {
    item,
    selected: bool,
  };

  module Updates = {
    let invert_select = model => {...model, selected: !model.selected};

    let change_item = (model, item) => {...model, item};
  };
};

module Action = {
  [@deriving sexp]
  type t =
    | ITEM_CHANGE(item)
    | SELECT_INVERT;

  let should_log = _ => true;
};

module State = {
  type t = unit;
};

let update_visibility = m => m;

let on_startup = (~schedule_action as _, _) => Async_kernel.return();

let on_display = (~old as _, _, _) => ();

let apply_action = (model, action, _, ~schedule_action as _) =>
  switch ((action: Action.t)) {
  | ITEM_CHANGE(item) => Model.Updates.change_item(model, item)
  | SELECT_INVERT => Model.Updates.invert_select(model)
  };

let view = (model: Incr.t(Model.t), ~inject) => {

};
*/

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

/* type retained_props_t = {
     item: Util.item,
     selected: bool,
   };

   type actions_t =
     | ITEM_CHANGE
     | SELECT_CHANGE;

   let component = ReasonReact.reducerComponent("Row");

   let glyph_icon =
     <span className="glyphicon glyphicon-remove" ariaHidden=true />;

   let make = (~onSelect, ~onRemove, ~selected, ~item: Util.item, _children) => {
     ...component,
     initialState: () => {item, selected},

     reducer: (action: actions_t, state: retained_props_t) => {
       switch (action) {
       | SELECT_CHANGE => ReasonReact.Update({...state, selected})
       | ITEM_CHANGE => ReasonReact.Update({...state, item})
       };
     },

     render: self => {
       if (selected != self.state.selected) {
         self.send(SELECT_CHANGE);
       };
       if (item !== self.state.item) {
         self.send(ITEM_CHANGE);
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
   }; */
