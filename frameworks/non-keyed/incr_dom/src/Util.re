open! Core_kernel;

let adjectives = [|
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy",
|];
let colours = [|
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange",
|];
let names = [|
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard",
|];

[@deriving sexp]
type fire_event_t =
  Js_of_ocaml.Js.t(Js_of_ocaml.Dom_html.mouseEvent) => Virtual_dom__.Event.t;

[@deriving (sexp, compare)]
type item = {
  id: int,
  label: string,
};

// This is for if you want to _index_ using items
// module Item_Mappable = {
//   module T = {
//     [@deriving (sexp, compare)]
//     type t = item;
//   };
//   include T;
//   include Comparable.Make(T);
// };

let build_data_impl = () => {
  let state = ref(1);

  let makeitem = n => {
    id: n + state^,
    label:
      Array.random_element_exn(adjectives)
      ++ " "
      ++ Array.random_element_exn(colours)
      ++ " "
      ++ Array.random_element_exn(names),
  };
  let generate = Array.init(_, ~f=makeitem);

  let impl = count => {
    let generated = generate(count);
    state := state^ + count;
    generated;
  };

  impl;
};

let build_data = build_data_impl();

let exclaim = (idx, d: item) =>
  if (0 == idx mod 10) {
    {...d, label: d.label ++ " !!!"};
  } else {
    d;
  };
