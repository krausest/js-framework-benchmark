import { Tr, Td, ForEachArray, Link, Span, Div, Table, TBody } from "native-document/elements";
import { useCache } from 'native-document';

import Jumbotron from "./components/Jumbotron";

import AppService from "./service";

const RemoveIcon = useCache(() => {
  return Link(Span({ class: 'glyphicon glyphicon-remove', 'aria-hidden': true }));
});


const TableRowBuilder = useCache(($binder) => {
  const $isSelected = $binder.class((item) => AppService.selected.when(item.id));

  return Tr( { class: { 'danger': $isSelected } }, [
    Td({ class: 'col-md-1' }, $binder.id),
    Td({ class: 'col-md-4' }, Link($binder.label)).nd.attach('onClick', AppService.select),
    Td({ class: 'col-md-1' },
      RemoveIcon().nd.attach('onClick', AppService.remove)
    ),
    Td({ class: 'col-md-6'})
  ]);
});

const App = Div({ class: 'container' }, [
  Jumbotron(),
  Table({ class: 'table table-hover table-striped test-data' },
    TBody(ForEachArray(AppService.data, TableRowBuilder, { isParentUniqueChild: true}))
  ),
  Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
]);

document.getElementById('root').appendChild(App);