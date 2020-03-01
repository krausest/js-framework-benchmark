open! Core_kernel;

let is_debug = false;

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

[@deriving (sexp, compare)]
type item = {
  id: int,
  label: string,
};

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
