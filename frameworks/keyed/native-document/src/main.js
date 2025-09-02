import { Tr, Td, ForEachArray, Link, Span, Div, Table, TBody } from "native-document/elements";

import Jumbotron from "./components/Jumbotron";
import RemoveIcon from "./components/RemoveIcon";

import AppService from "./service";


const Attributes = {
  table: { class: 'table table-hover table-striped test-data' },
  cell_md_1: { class: 'col-md-1' },
  cell_md_4: { class: 'col-md-4' },
};

const emptyCell = Td.cached({ class: 'col-md-6'});
const TableRowBuilder = (item) => {
  return Tr( { class: { 'danger': AppService.selected.when(item.id) } }, [
    Td(Attributes.cell_md_1, item.id),
    Td(Attributes.cell_md_4, Link(item.label)).nd.onClick(() => AppService.select(item.id)),
    Td(Attributes.cell_md_1,
      RemoveIcon(item.id).nd.onClick(() => AppService.remove(item.id))
    ),
    emptyCell
  ]);
};

const App = Div({ class: 'container' }, [
  Jumbotron(),
  Table(Attributes.table,
    TBody(ForEachArray(AppService.data, TableRowBuilder, 'id', { isParentUniqueChild: true}))
  ),
  Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
]);

document.getElementById('root').appendChild(App);