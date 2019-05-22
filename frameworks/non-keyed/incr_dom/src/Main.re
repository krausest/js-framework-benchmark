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

let component = ReasonReact.reducerComponent("Main");

/*
 let exclaim_inplace = (arr: array(Util.item)) => {
   let impl = (idx, d: Util.item) =>
     if (0 == idx mod 10) {
       arr[idx] = {...d, label: d.label ++ " !!!"};
     };
   impl;
 };
 */

let make = _children => {
  ...component,

  initialState: () => {data: [||], selected: None},

  reducer: (action: main_actions_t, state: main_state_t) =>
    switch (action) {
    | RUN => ReasonReact.Update({...state, data: Util.build_data(1000)})

    | RUNLOTS => ReasonReact.Update({...state, data: Util.build_data(10000)})

    | ADD =>
      ReasonReact.Update({
        ...state,
        data: Belt.Array.concat(state.data, Util.build_data(1000)),
      })

    | UPDATEEVERYTENTH =>
      /*
       Array.iteri(exclaim_inplace(state.data), state.data);
       ReasonReact.Update(state);
       */
      ReasonReact.Update({...state, data: Array.mapi(exclaim, state.data)})

    | SELECT(i) => ReasonReact.Update({...state, selected: Some(i)})

    | REMOVE(i) =>
      let isnt_item = c => !(i === c);
      switch (state.selected) {
      | Some(n) when n === i =>
        ReasonReact.Update({
          selected: None,
          data: Js.Array.filter(isnt_item, state.data),
        })
      | _ =>
        ReasonReact.Update({
          ...state,
          data: Js.Array.filter(isnt_item, state.data),
        })
      };

    | CLEAR => ReasonReact.Update({data: [||], selected: None})

    | SWAPROWS =>
      if (Array.length(state.data) > 998) {
        let elem_1 = state.data[1];
        let elem_2 = state.data[998];
        state.data[1] = elem_2;
        state.data[998] = elem_1;
        ReasonReact.Update(state);
      } else {
        ReasonReact.NoUpdate;
      }
    },

  render: self => {
    let sender = (message, _event) => self.send(message);
    let is_selected =
      switch (self.state.selected) {
      | None => (_i => false)
      | Some(n) => ((i: Util.item) => i === n)
      };

    <div className="container">
      <Jumbotron
        run={sender(RUN)}
        runLots={sender(RUNLOTS)}
        add={sender(ADD)}
        update={sender(UPDATEEVERYTENTH)}
        clear={sender(CLEAR)}
        swapRows={sender(SWAPROWS)}
      />
      <table className="table table-hover table-striped test-data">
        <tbody>
          ...{Array.map(
            (item: Util.item) =>
              <Row
                key={item.id |> string_of_int}
                item
                selected={is_selected(item)}
                onSelect={sender(SELECT(item))}
                onRemove={sender(REMOVE(item))}
              />,
            self.state.data,
          )}
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        ariaHidden=true
      />
    </div>;
  },
};
