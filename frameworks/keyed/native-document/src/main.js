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
            let isSelected = Observable(false);
            AppService.selected.on(item.id, () => {
              isSelected.set(true)
            }, () => {
              isSelected.set(false);
            });

            return Tr( { class: { 'danger': isSelected } }, [
              Td({ class: 'col-md-1' }, item.id),
              Td({ class: 'col-md-4', 'data-sid': item.id },
                Link({ 'data-sid': item.id }, item.label)
              ).nd.onClick(() => AppService.select(item.id)),
              Td({ class: 'col-md-1' },RemoveIcon(item.id)),
              Td({ class: 'col-md-6'},'')
            ]);
          },
          'id')
      ),
      Span({ class: 'preloadicon glyphicon glyphicon-remove', 'aria-hidden': true })
    ])
  ]);
}

document.querySelector('#main').append(App());