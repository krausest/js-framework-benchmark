type main_state_t = {
  data: array(Util.item),
  selected: option(Util.item),
};

type main_actions_t =
  | RUN
  | RUNLOTS
  | ADD
  | UPDATEEVERYTENTH
  | SELECT(Util.item)
  | REMOVE(Util.item)
  | CLEAR
  | SWAPROWS;

let exclaim = (idx, d: Util.item) =>
  if (0 == idx mod 10) {
    {...d, label: d.label ++ " !!!"};
  } else {
    d;
  };

let reducer = (state: main_state_t, action: main_actions_t) => {
  switch (action) {
  | RUN => {...state, data: Util.build_data(1000)}

  | RUNLOTS => {...state, data: Util.build_data(10000)}

  | ADD => {
      ...state,
      data: Belt.Array.concat(state.data, Util.build_data(1000)),
    }

  | UPDATEEVERYTENTH =>
    /*
     Array.iteri(exclaim_inplace(state.data), state.data);
     (state);
     */
    {...state, data: Array.mapi(exclaim, state.data)}

  | SELECT(i) => {...state, selected: Some(i)}

  | REMOVE(i) =>
    let isnt_item = c => !(i === c);
    switch (state.selected) {
    | Some(n) when n === i => {
        selected: None,
        data: Js.Array.filter(isnt_item, state.data),
      }
    | _ => {...state, data: Js.Array.filter(isnt_item, state.data)}
    };

  | CLEAR => {data: [||], selected: None}

  | SWAPROWS =>
    if (Array.length(state.data) > 998) {
      let elem_1 = state.data[1];
      let elem_2 = state.data[998];
      state.data[1] = elem_2;
      state.data[998] = elem_1;
      {...state, data: state.data};
    } else {
      {...state, data: state.data};
    }
  };
};

let initialState = {data: [||], selected: None};

type cb_t = ReactEvent.Mouse.t => unit;

type cb_record_t = {
  run: cb_t,
  runLots: cb_t,
  add: cb_t,
  update: cb_t,
  clear: cb_t,
  swapRows: cb_t,
  onSelect: Util.item => unit,
  onRemove: Util.item => unit,
};

let is_selected = (state, item: Util.item) => {
  switch (state.selected) {
  | None => false
  | Some(it) => it === item
  };
};

[@react.component]
let make = () => {
  let (state, dispatch) = React.useReducer(reducer, initialState);

  let cb =
    React.useMemo(() => {
      let sender = (message: main_actions_t, _event) => dispatch(message);
      {
        run: sender(RUN),
        runLots: sender(RUNLOTS),
        add: sender(ADD),
        update: sender(UPDATEEVERYTENTH),
        clear: sender(CLEAR),
        swapRows: sender(SWAPROWS),
        onSelect: item => dispatch(SELECT(item)),
        onRemove: item => dispatch(REMOVE(item)),
      };
    });

  <div className="container">
    <Jumbotron
      key="jumbotron"
      run={cb.run}
      runLots={cb.runLots}
      add={cb.add}
      update={cb.update}
      clear={cb.clear}
      swapRows={cb.swapRows}
    />
    <table className="table table-hover table-striped test-data">
      <tbody>
        {ReasonReact.array(
           Array.map(
             (item: Util.item) =>
               <Row
                 key={item.id |> string_of_int}
                 item
                 selected={item |> is_selected(state)}
                 onSelect={cb.onSelect}
                 onRemove={cb.onRemove}
               />,
             state.data,
           ),
         )}
      </tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" ariaHidden=true />
  </div>;
};