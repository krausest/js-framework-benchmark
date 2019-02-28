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

type item = {
  id: int,
  label: string,
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
    let generated = Belt.Array.makeBy(count, makeitem);
    state := state^ + count;
    generated;
  };

  impl;
};

let build_data = build_data_impl();
