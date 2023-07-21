/**
 * Incremental DOM is a virtual-dom diffing library; not a framework.
 * See: http://google.github.io/incremental-dom/
 */

import { patch } from "incremental-dom";
import { DataCollection } from "./data-collection";

import { Button } from "./components/button";
import { H1 } from "./components/header";
import { Div } from "./components/div";
import { GlyphIconSpan } from "./components/span";
import { Table, TableRow } from "./components/table";


let root: HTMLElement;
let state: DataCollection = new DataCollection();
let selectedId: number = null;

function render() {
  if (!root) root = document.getElementById('main')!;
  patch(root, incrementalDom);
}

function actionRun() {
  state.createRows(1000);
  render();
}

function actionRunLots() {
  state.createRows(10000);
  render();
}

function actionAdd() {
  state.appendRows(1000);
  render();
}

function actionUpdate() {
  state.mutate((e) => { e.label += ' !!! ' }, 10);
  render();
}

function actionClear() {
  state.clear();
  render();
}

function actionSwapRows() {
  state.swap(1, 998);
  render();
}

function actionSelectRow(id: number) {
  selectedId = id;
  render();
}

function actionDeleteRow(id: number) {
  state.delete(id);
  render();
}


function incrementalDom() {
  const divBtnClass = 'col-sm-6 smallpad';

  Div('container', () => {
    Div('jumbotron', () => {
      Div('row', () => {
        Div('col-md-6', () => {
          H1('Incremental DOM-"keyed"');
        });
        Div('col-md-6', () => {
          Div(divBtnClass, () => Button('run', 'Create 1,000 rows', actionRun));
          Div(divBtnClass, () => Button('runlots', 'Create 10,000 rows', actionRunLots));
          Div(divBtnClass, () => Button('add', 'Append 1,000 rows', actionAdd));
          Div(divBtnClass, () => Button('update', 'Update every 10th row', actionUpdate));
          Div(divBtnClass, () => Button('clear', 'Clear', actionClear));
          Div(divBtnClass, () => Button('swaprows', 'Swap Rows', actionSwapRows));
        });
      });
    });
    Table(() => {
      for (let i = 0; i < state.data.length; i++) {
        const id = state.data[i].id;
        TableRow(state.data[i], selectedId === id, () => actionSelectRow(id), () => actionDeleteRow(id));
      }
    });
    GlyphIconSpan();
  });

}

window.addEventListener('load', render);
