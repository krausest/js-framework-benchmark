import { Tr, Td, ForEachArray, Link, Span, Div, Table, TBody } from "native-document/elements";
import { useCache } from 'native-document';

import Jumbotron from "./components/Jumbotron";

import AppService from "./service";

const RemoveIcon = useCache(() => {
  return Link(Span({ class: 'glyphicon glyphicon-remove', 'aria-hidden': true }));
});

const EmptyCell = useCache(() => Td({ class: 'col-md-6'}));

const TableRowBuilder = (item) => {

  return Tr( { class: { 'danger': AppService.selected.when(item.id) } }, [
    Td({ class: 'col-md-1' }, item.id),
    Td({ class: 'col-md-4' }, Link(item.label)).nd.onClick(() => AppService.select(item)),
    Td({ class: 'col-md-1' }, RemoveIcon().nd.onClick(() => AppService.remove(item)),),
    EmptyCell
  ]);
};

const App = Div({ class: 'container' }, [
  Jumbotron(),
  Table({ class: 'table table-hover table-striped test-data' },
    TBody(ForEachArray(AppService.data, TableRowBuilder, { isParentUniqueChild: true }))
  ),
  Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
]);

document.getElementById('root').appendChild(App);