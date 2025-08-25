import { Tr, Td, ForEachArray, Link, Span, Div, Table, TBody } from "native-document/elements";
import { Observable } from "native-document";

import Jumbotron from "./components/Jumbotron";
import RemoveIcon from "./components/RemoveIcon";

import AppService from "./service";

const App = () => {

  return Div({ class: 'container' }, [
    Jumbotron(),
    Table({ class: 'table table-hover table-striped test-data' }, [
      TBody(
        ForEachArray(AppService.data, (item) => {
            return Tr( { class: { 'danger': AppService.selected.is(item.id) } }, [
              Td({ class: 'col-md-1' }, item.id),
              Td({ class: 'col-md-4' },
                Link(item.label)
              ).nd.onClick(() => AppService.select(item.id)),
              Td({ class: 'col-md-1' }, RemoveIcon(item.id)),
              Td({ class: 'col-md-6'})
            ]);
          },
          'id')
      ),
      Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
    ])
  ]);
}

document.querySelector('#main').append(App());