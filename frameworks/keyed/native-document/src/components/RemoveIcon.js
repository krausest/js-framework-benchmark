import { Link, Span } from "native-document/elements";
import AppService from "../service";

export default function RemoveIcon(itemId){
  return Link(
    Span({ class: 'glyphicon glyphicon-remove', 'aria-hidden': true })
  ).nd.onClick(() => AppService.remove(itemId));
};