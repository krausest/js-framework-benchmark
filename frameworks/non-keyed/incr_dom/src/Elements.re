open Incr_dom;

let or_empty =
  fun
  | None => Random.bits() |> string_of_int
  | Some(x) => x;

let sanitise_classname =
  fun
  | None => Random.bits() |> string_of_int |> Vdom.Attr.class_
  | Some(className) => {
      Console.log(className);
      if (String.contains(className, ' ')) {
        Vdom.Attr.classes(Core_kernel.String.split(className, ~on=' '));
      } else {
        Vdom.Attr.class_(className);
      };
    };

let body = (~children, _) => Vdom.Node.body([], children);

let div = (~className=?, ~children, _) => {
  Vdom.Node.div([sanitise_classname(className)], children);
};

let button = (~id=?, ~className=?, ~onClick, ~children, _) => {
  Vdom.Node.button(
    [
      Vdom.Attr.on_click(onClick),
      sanitise_classname(className),
      Vdom.Attr.id(or_empty(id)),
      Vdom.Attr.type_("button"),
    ],
    children,
  );
};
