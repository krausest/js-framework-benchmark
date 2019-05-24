open! Core_kernel;
open Incr_dom;
open Elements;
open Util;

module Model = {
  [@deriving (sexp, fields, compare)]
  type t = {
    // TODO: Change this back to an Int.Map.t once it's working
    data: array(item),
    selected: option(item),
  };

  module Updates = {
    let create_some = (model, n) => {
      let newdata = Util.build_data(n);
      {...model, data: newdata};
    };

    let add_some = (model, n) => {
      let newdata = Util.build_data(n);
      {...model, data: Array.append(model.data, newdata)};
    };

    let update_every_10 = model => {
      {...model, data: Array.mapi(model.data, ~f=exclaim)};
    };

    let select = (model, item) => {
      {...model, selected: Some(item)};
    };

    let swap_rows = model =>
      if (Array.length(model.data) > 998) {
        let newdata = Array.copy(model.data);
        newdata[1] = model.data[998];
        newdata[998] = model.data[1];
        {...model, data: newdata};
      } else {
        model;
      };

    let remove_item = (model, item) => {
      let isnt_item = c => !phys_equal(item, c);
      switch (model.selected) {
      | Some(n) when phys_equal(n, item) => {
          selected: None,
          data: Array.filter(model.data, ~f=isnt_item),
        }
      | _ => {...model, data: Array.filter(model.data, ~f=isnt_item)}
      };
    };
  };

  let empty = {data: [||], selected: None};

  let cutoff = (t1, t2) => compare(t1, t2) == 0;
};

module Action = {
  [@deriving sexp]
  type t =
    | RUN
    | RUNLOTS
    | ADD
    | UPDATEEVERYTENTH
    | SELECT(Util.item)
    | REMOVE(Util.item)
    | CLEAR
    | SWAPROWS;

  let should_log = _ => true;
};

module State = {
  type t = unit;
};

let apply_action = (model, action, _, ~schedule_action as _) =>
  switch ((action: Action.t)) {
  | RUN => Model.Updates.create_some(model, 1000)
  | RUNLOTS => Model.Updates.create_some(model, 10000)
  | ADD => Model.Updates.add_some(model, 1000)
  | UPDATEEVERYTENTH => Model.Updates.update_every_10(model)
  | SELECT(item) => Model.Updates.select(model, item)
  | SWAPROWS => Model.Updates.swap_rows(model)
  | REMOVE(item) => Model.Updates.remove_item(model, item)
  | CLEAR => Model.empty
  };

let update_visibility = m => m;

let on_startup = (~schedule_action as _, _) => Async_kernel.return();

let on_display = (~old as _, _, _) => ();

let view = (model: Incr.t(Model.t), ~inject) => {
  open Incr.Let_syntax;

  let sender = (action, _) => inject(action);

  let jumbotron =
    Action.(
      <Jumbotron
        run={sender(RUN)}
        runLots={sender(RUNLOTS)}
        add={sender(ADD)}
        update={sender(UPDATEEVERYTENTH)}
        clear={sender(CLEAR)}
        swapRows={sender(SWAPROWS)}
      />
    );

  let%map rows = model >>| Model.data
  and selected_item = model >>| Model.selected;

  let is_selected =
    switch (selected_item) {
    | None => (_i => false)
    | Some(n) => ((item: Util.item) => phys_equal(item, n))
    };

  let rows =
    Array.map(rows, ~f=item =>
      Action.(
        <Row
          //  NOTE: Missing the 'key' here, not sure if this is required
          onSelect={sender(SELECT(item))}
          onRemove={sender(REMOVE(item))}
          selected={is_selected(item)}
          item
        />
      )
    );

  let rows = Array.to_list(rows);

  <div className="container">
    jumbotron
    <table className="table table-hover table-striped test-data">
      <tbody> ...rows </tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" ariaHidden=true />
  </div>;
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
