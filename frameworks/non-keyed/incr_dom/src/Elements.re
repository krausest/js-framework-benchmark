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

let genericElement:
  (
    (list(Vdom.Attr.t), list(Vdom.Node.t)) => 'b,
    ~className: string=?,
    ~onClick: Js_of_ocaml.Js.t(Js_of_ocaml.Dom_html.mouseEvent) =>
              Vdom.Event.t
                =?,
    ~children: list(Vdom.Node.t),
    'a
  ) =>
  'b =
  (
    creator,
    ~className=?,
    ~onClick=?,
    ~children,
    _,
  ) => {
    let attrs = [sanitise_classname(className)];

    let fold_attrs = (acc, (type_, next)) =>
      switch (next) {
      | None => acc
      | Some(attr) => [type_(attr), ...acc]
      };

    let attrs =
      List.fold_left(fold_attrs, attrs, [(Vdom.Attr.on_click, onClick)]);

    creator(attrs, children);
  };

let div = genericElement(Vdom.Node.div);
let h1 = genericElement(Vdom.Node.h1);
let tr = genericElement(Vdom.Node.tr);
let td = genericElement(Vdom.Node.td);
let a = genericElement(Vdom.Node.a);

/* let div = (~className=?, ~children, _) => {
     genericElement(Vdom.Node.div, ~className, ~children);
   };

   let h1 = (~className=?, ~children, _) => {
     genericElement(Vdom.Node.h1, ~className, ~children);
   };

   let tr = (~className=?, ~children, _) => {
     genericElement(Vdom.Node.tr, ~className, ~children);
   };

   let td = (~className=?, ~children, _) => {
     genericElement(Vdom.Node.td, ~className, ~children);
   };

   let a = (~className=?, ~onClick=?, ~children, _) => {
     genericElement(Vdom.Node.a, ~className, ~onClick, ~children);
   }; */

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
