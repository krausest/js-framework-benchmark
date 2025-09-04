import { Tr, Td, ForEachArray, Link, Span, Div, Table, TBody } from "native-document/elements";
import { useCache } from 'native-document';

import Jumbotron from "./components/Jumbotron";
import RemoveIcon from "./components/RemoveIcon";

import AppService from "./service";


const Attributes = {
  table: { class: 'table table-hover table-striped test-data' },
};

const TableRowBuilder = useCache(($binder) => {

  const isSelected = $binder.class((item) => AppService.selected.when(item.id));
  const id = $binder.value((item) => item.id);
  const label = $binder.value((item) => item.label);

  const rowClick = $binder.attach((_, item) => AppService.select(item.id));
  const removeClick = $binder.attach((_, item) => AppService.remove(item.id));

  return Tr( { class: { 'danger': isSelected } }, [
    Td({ class: 'col-md-1' }, id),
    Td({ class: 'col-md-4' }, Link(label)).nd.attach('onClick', rowClick),
    Td({ class: 'col-md-1' },
      RemoveIcon().nd.attach('onClick', removeClick)
    ),
    Td({ class: 'col-md-6'})
  ]);
});

const App = Div({ class: 'container' }, [
  Jumbotron(),
  Table(Attributes.table,
    TBody(ForEachArray(AppService.data, TableRowBuilder, 'id', { isParentUniqueChild: true}))
  ),
  Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
]);

document.getElementById('root').appendChild(App);