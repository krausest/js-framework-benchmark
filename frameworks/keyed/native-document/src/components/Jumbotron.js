import { Button, Div, H1 } from "native-document/elements";
import AppService from "../service";

const JumbotromButton = function(title, id, onClick) {
  return Div({ class: 'col-sm-6 smallpad' }, [
    Button({ id , class: 'btn btn-primary btn-block' }, title).nd.onClick(onClick)
  ]);
};

export  default function Jumbotron() {
  return Div({ class: 'jumbotron' }, [
    Div({ class: 'row' }, [
      Div({ class: 'col-md-6' }, [
        H1('Native Document (Keyed)'),
      ]),
      Div({ class: 'col-md-6' }, [
        Div({ class: 'row' }, [
          JumbotromButton('Create 1,000 rows', 'run', AppService.run),
          JumbotromButton('Create 10,000 rows', 'runlots', AppService.runLots),
          JumbotromButton('Append 1,000 rows', 'add', AppService.add),
          JumbotromButton('Update every 10th row', 'update', AppService.update),
          JumbotromButton('Clear', 'clear', AppService.clear),
          JumbotromButton('Swap Rows', 'swaprows', AppService.swapRows),
        ])
      ])
    ])
  ])
}