open! Core_kernel;
open Incr_dom;
open Elements;

open Util;

module Model = {
  [@deriving (sexp, fields)]
  type t = {
    item,
    selected: bool,
    onSelect: fire_event_t,
    onRemove: fire_event_t,
  };

  module Updates = {
    let invert_select = model => {...model, selected: !model.selected};

    let change_item = (model, item) => {...model, item};
  };

  let cutoff = (t1, t2) => {
    phys_equal(t1.item, t2.item) && phys_equal(t1.selected, t2.selected);
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
  open Incr.Let_syntax;

  let%map item = model >>| Model.item
  and selected = model >>| Model.selected
  and onSelect = model >>| Model.onSelect
  and onRemove = model >>| Model.onRemove;

  <Row item selected onSelect onRemove />;
};

let create = (model: Incr.t(Model.t), ~old_model as _, ~inject) => {
  open Incr.Let_syntax;
  let%map apply_action = {
    let%map model = model;
    apply_action(model);
  }
  and view = view(model, ~inject)
  and model = model;

  Component.create(~apply_action, model, view);
};
