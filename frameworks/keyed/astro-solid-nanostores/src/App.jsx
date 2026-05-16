import { useStore } from "@nanostores/solid";
import { For } from "solid-js";
import { rows, selectedId, run, runLots, add, update, clear, swapRows, removeRow, select } from "./store.js";

const Button = ([id, text, fn]) => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
      {text}
    </button>
  </div>
);

export default function App() {
  const $rows = useStore(rows);
  const $selectedId = useStore(selectedId);

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Astro-solid-nanostores-keyed</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button {...["run", "Create 1,000 rows", run]} />
              <Button {...["runlots", "Create 10,000 rows", runLots]} />
              <Button {...["add", "Append 1,000 rows", add]} />
              <Button {...["update", "Update every 10th row", update]} />
              <Button {...["clear", "Clear", clear]} />
              <Button {...["swaprows", "Swap Rows", swapRows]} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <For each={$rows()}>
            {(item) => (
              <tr class={$selectedId() === item.id ? "danger" : ""}>
                <td class="col-md-1" textContent={item.id} />
                <td class="col-md-4">
                  <a onClick={() => select(item.id)} textContent={item.label} />
                </td>
                <td class="col-md-1">
                  <a onClick={() => removeRow(item.id)}>
                    <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                  </a>
                </td>
                <td class="col-md-6" />
              </tr>
            )}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
