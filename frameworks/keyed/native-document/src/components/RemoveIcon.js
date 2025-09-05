import { Link, Span } from "native-document/elements";


export default (function RemoveIcon(attributes) {
  return Link(Span(attributes));
}).cached({ class: 'glyphicon glyphicon-remove', 'aria-hidden': true });