open! Core_kernel;
open Incr_dom;
open Elements;
open Util;

module Model = {
  [@deriving (sexp, fields, compare)]
  type t = {
    counters: Int.Map.t(int),
    data: array(item),
  };

  let addNew = t => {
    let counters =
      Int.Map.set(t.counters, ~key=Map.length(t.counters), ~data=0);
    {...t, counters};
  };

  /* no bounds checks */
  let update = (t, pos, diff) => {
    let oldVal = Map.find_exn(t.counters, pos);
    let counters = Int.Map.set(t.counters, ~key=pos, ~data=oldVal + diff);
    {...t, counters};
  };

  let cutoff = (t1, t2) => compare(t1, t2) == 0;
};

module Action = {
  [@deriving sexp]
  type t =
    | NewCounter
    | Update(int, int) /* pos, diff */
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
  | NewCounter => Model.addNew(model)
  | Update(pos, diff) => Model.update(model, pos, diff)
  | _ => model
  };

let update_visibility = m => m;

let on_startup = (~schedule_action as _, _) => Async_kernel.return();

let on_display = (~old as _, _, _) => ();

let view = (m: Incr.t(Model.t), ~inject) => {
  open Incr.Let_syntax;
  open Vdom;

  let sender = (action, _) => inject(action);

  let make_rows =
    Action.(
      Array.map(_, ~f=item =>
        <div key={item.id}>
          <Row
            onSelect={sender(SELECT(item))}
            onRemove={sender(REMOVE(item))}
            selected=false
            item
          />
        </div>
      )
    );

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

  let addNewCounterButton =
    <div>
      jumbotron
      <button onClick={_ev => inject(Action.NewCounter)}>
        {Node.text("Add new counter")}
      </button>
    </div>;

  let button = (txt, pos, diff) => {
    let onClick = _ev => inject(Action.Update(pos, diff));
    <button onClick> {Node.text(txt)} </button>;
  };

  let%map elements =
    Incr.Map.mapi'(
      m >>| Model.counters,
      ~f=(~key as pos, ~data as value) => {
        let button_minus = button("-", pos, -1);
        let button_plus = button("+", pos, 1);
        let%map value = value;
        <div>
          button_minus
          {Node.text(Int.to_string(value))}
          button_plus
        </div>;
      },
    );
  <body> ...{List.cons(addNewCounterButton, Map.data(elements))} </body>;
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
