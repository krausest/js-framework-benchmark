module R = Reaml

let adjectives = [| "pretty"; "large"; "big"; "small"; "tall"; "short"; "long";
"handsome"; "plain"; "quaint"; "clean"; "elegant"; "easy"; "angry"; "crazy";
"helpful"; "mushy"; "odd"; "unsightly"; "adorable"; "important" ; "inexpensive";
"cheap"; "expensive"; "fancy" |] [@@ocamlformat "disable"]

let colors = [| "red"; "yellow"; "blue"; "green"; "pink"; "brown"; "purple" ;
"brown"; "white"; "black"; "orange" |] [@@ocamlformat "disable"]

let nouns = [| "table"; "chair"; "house"; "bbq"; "desk"; "car"; "pony";
"cookie"; "sandwich"; "burger"; "pizza"; "mouse"; "keyboard" |] [@@ocamlformat
"disable"]

let sample array =
  Js.Array.unsafe_get array (Js.Math.random_int 0 (Js.Array.length array))

module Store = struct
  type row = {
    id : int;
    label : string;
  }

  type state = {
    data : row array;
    selected : int option;
  }

  type action =
    | Create of int
    | Append of int
    | UpdateEvery of int
    | Clear
    | Swap of int * int
    | Select of int
    | Remove of int

  let nextId = ref 1

  let makeRow () =
    let id = !nextId in
    nextId := id + 1;
    { id; label = sample adjectives ^ " " ^ sample colors ^ " " ^ sample nouns }

  let makeRows count = Belt.Array.makeBy count (fun _ -> makeRow ())

  let reducer state = function
    | Create n -> { data = makeRows n; selected = None }
    | Append n -> { state with data = Belt.Array.concat state.data (makeRows n) }
    | UpdateEvery n ->
      {
        state with
        data =
          Belt.Array.mapWithIndex state.data (fun index row ->
              if index mod n = 0 then { row with label = row.label ^ " !!!" } else row);
      }
    | Clear -> { data = [||]; selected = None }
    | Swap (a, b) ->
      let data =
        match Belt.Array.get state.data a, Belt.Array.get state.data b with
        | Some aa, Some bb ->
          Belt.Array.mapWithIndex state.data (fun index row ->
              if index = a then bb else if index = b then aa else row)
        | _ -> state.data
      in
      { state with data }
    | Remove id ->
      let data = Belt.Array.keep state.data (fun row -> row.id <> id) in
      { state with data }
    | Select id -> { state with selected = Some id }

  let use =
   fun [@reaml.hook] () ->
    let[@reaml] state, dispatch = R.useReducer reducer { data = [||]; selected = None } in
    state, dispatch
end

module Row = struct
  type props = {
    key : int;
    row : Store.row;
    selected : bool;
    dispatch : Store.action -> unit;
  }

  let make =
   fun [@reaml.component.memo "Row"] { row; selected; dispatch } ->
    let onSelect _ = dispatch (Select row.id) in
    let onRemove _ = dispatch (Remove row.id) in
    R.tr
      (if selected then [ R.class_ "danger" ] else [])
      [
        R.td [ R.class_ "col-md-1" ] [ R.int row.id ];
        R.td [ R.class_ "col-md-4" ] [ R.a [ R.onClick onSelect ] [ R.string row.label ] ];
        R.td [ R.class_ "col-md-1" ]
          [
            R.a [ R.onClick onRemove ]
              [
                R.span
                  [ R.class_ "glyphicon glyphicon-remove"; R.aria "hidden" "true" ]
                  [];
              ];
          ];
        R.td [ R.class_ "col-md-6" ] [];
      ]
end

let jumbotron (dispatch : Store.action -> unit) =
  let button id title action =
    R.div
      [ R.class_ "col-sm-6 smallpad" ]
      [
        R.button
          [
            R.type_ "button";
            R.class_ "btn btn-primary btn-block";
            R.id id;
            R.onClick (fun _ -> dispatch action);
          ]
          [ R.string title ];
      ]
  in
  R.div [ R.class_ "jumbotron" ]
    [
      R.div [ R.class_ "row" ]
        [
          R.div [ R.class_ "col-md-6" ] [ R.h1 [] [ R.string "Reaml Keyed" ] ];
          R.div [ R.class_ "col-md-6" ]
            [
              R.div [ R.class_ "row" ]
                [
                  button "run" "Create 1,000 rows" (Create 1000);
                  button "runlots" "Create 10,000 rows" (Create 10000);
                  button "add" "Append 1,000 rows" (Append 1000);
                  button "update" "Update every 10th row" (UpdateEvery 10);
                  button "clear" "Clear" Clear;
                  button "swaprows" "Swap Rows" (Swap (1, 998));
                ];
            ];
        ];
    ]

module Main = struct
  let make =
   fun [@reaml.component "Main"] () ->
    let[@reaml] state, dispatch = Store.use () in
    R.div [ R.class_ "container" ]
      [
        jumbotron dispatch;
        R.table
          [ R.class_ "table table-hover table-striped test-data" ]
          [
            R.tbody []
              [
                Belt.Array.map state.data (fun (row : Store.row) ->
                    Row.make
                      {
                        key = row.id;
                        row;
                        selected = state.selected = Some row.id;
                        dispatch;
                      })
                |> R.array;
              ];
          ];
        R.span
          [ R.class_ "preloadicon glyphicon glyphicon-remove"; R.aria "hidden" "true" ]
          [];
      ]
end

let () = Main.make () |> R.renderTo "main"
