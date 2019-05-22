open! Core_kernel;
open Incr_dom;
open Elements;
open Util;

module Model = {
  [@deriving (sexp, fields, compare)]
  type t = {
    data: array(item),
    selected: option(item),
  };

  // -  let addNew = t => {
  //   -    let counters =
  //   -      Int.Map.set(t.counters, ~key=Map.length(t.counters), ~data=0);
  //   -    {...t, counters};
  //   -  };
  //   -
  //   -  /* no bounds checks */
  //   -  let update = (t, pos, diff) => {
  //   -    let oldVal = Map.find_exn(t.counters, pos);
  //   -    let counters = Int.Map.set(t.counters, ~key=pos, ~data=oldVal + diff);
  //   -    {...t, counters};

  let create1000 = model => {
    let newdata = Util.build_data(1000);
    {...model, data: newdata};
  };

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
  | RUN => Model.create1000(model)
  | _ => model
  // -  | NewCounter => Model.addNew(model)
  // -  | Update(pos, diff) => Model.update(model, pos, diff)
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

  let%map rows =
    model
    >>| (
      x =>
        x.data
        |> Array.map(_, ~f=item =>
             Action.(
               <div key={item.id}>
                 <Row
                   onSelect={sender(SELECT(item))}
                   onRemove={sender(REMOVE(item))}
                   selected=false
                   item
                 />
               </div>
             )
           )
    );

  let rows = rows |> Array.to_list;

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
