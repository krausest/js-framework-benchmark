import { render, swap, ref } from "signal-jsx";

import { buildData } from "./data";

import { Button } from "./Button";

import { type Props, List } from "./Row";

export function App() {
  const root = ref();
  let data: Props[] | null;

  const run = () => render(List((data = buildData(1000))), root.value!),
    runLots = () => {
      root.value!.replaceChildren();
      render(List((data = buildData(10000))), root.value!);
    },
    add = () => {
      const append = buildData(1000);
      data!.concat(append);
      render(List(append), root.value!);
    },
    update = () => {
      for (let i = 0, len = data!.length; i < len; i += 10) {
        const { label } = data![i]!;
        label.update(label.value + " !!!");
      }
    },
    swapRows = () => {
      if (data!.length > 998) swap(data![1]!.ref!, data![998]!.ref!);
    },
    clear = () => {
      root.value!.replaceChildren();
      data = null;
    };

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>signal-jsx-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" fn={run} />
              <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
              <Button id="add" text="Append 1,000 rows" fn={add} />
              <Button id="update" text="Update every 10th row" fn={update} />
              <Button id="clear" text="Clear" fn={clear} />
              <Button id="swaprows" text="Swap Rows" fn={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody ref={root.value}></tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
