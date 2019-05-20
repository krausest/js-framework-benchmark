open! Core_kernel;

let random = max => Random.int(max);

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
type item = {
  id: int,
  label: string,
};

let makeBy = (count_, maker) => {
  let rec impl = acc =>
    fun
    | 0 => acc
    | n => impl([maker(n), ...acc], n - 1);

  impl([], count_) |> Array.of_list;
};

let build_data_impl = () => {
  let state = ref(1);

  let impl = count => {
    let makeitem = n => {
      id: n + state^,
      label:
        adjectives[random(Array.length(adjectives))]
        ++ " "
        ++ colours[random(Array.length(colours))]
        ++ " "
        ++ names[random(Array.length(names))],
    };

    let generated = makeBy(count, makeitem);
    state := state^ + count;
    generated;
  };

  impl;
};

let build_data = build_data_impl();
