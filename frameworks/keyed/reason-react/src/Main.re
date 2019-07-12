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

// let component = ReasonReact.reducerComponent("Main");

let exclaim = (idx, d: Util.item) =>
  if (0 == idx mod 10) {
    {...d, label: d.label ++ " !!!"};
  } else {
    d;
  };

/*
 let exclaim_inplace = (arr: array(Util.item)) => {
   let impl = (idx, d: Util.item) =>
     if (0 == idx mod 10) {
       arr[idx] = {...d, label: d.label ++ " !!!"};
     };
   impl;
 };
 */

let reducer = (state: main_state_t, action: main_actions_t) =>
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
      state;
    } else {
      state;
    }
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

// type cb_t = {

// }

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
        onSelect: item => sender(SELECT(item)) |> ignore,
        onRemove: item => sender(REMOVE(item)) |> ignore,
      };
    });

  let is_selected =
    switch (state.selected) {
    | None => (_i => false)
    | Some(n) => ((i: Util.item) => i === n)
    };

  <div className="container">
    <Jumbotron
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
                 selected={is_selected(item)}
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