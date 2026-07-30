import { mount } from "valyrian.js";
import { Store } from "./store";

const store = new Store();

function Button({ text, ...props }: any) {
  return (
    <div class="col-sm-6 smallpad">
      <button type="button" class="btn btn-primary btn-block" {...props} />
    </div>
  );
}

function App() {
  return (
    <div id="main">
      <div class="container">
        <div class="jumbotron" v-keep>
          <div class="row">
            <div class="col-md-6">
              <h1>Valyrian.Js</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <Button id="run" v-text="Create 1,000 rows" onclick={() => store.run()} />
                <Button id="runlots" v-text="Create 10,000 rows" onclick={() => store.runLots()} />
                <Button id="add" v-text="Append 1,000 rows" onclick={() => store.add()} />
                <Button id="update" v-text="Update every 10th row" onclick={() => store.update()} />
                <Button id="clear" v-text="Clear" onclick={() => store.clear()} />
                <Button id="swaprows" v-text="Swap Rows" onclick={() => store.swapRows()} />
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">
          <tbody id="tbody" v-for={store.data}>
            {(item: { id: number; label: string }) => {
              const selected = item.id === store.selected ? "danger" : "";
              return (
                <tr key={item.id} v-keep={`${item.label}${selected}`} class={selected}>
                  <td class="col-md-1" v-text={item.id} />
                  <td v-keep={item.label} class="col-md-4">
                    <a onclick={() => store.select(item.id)} v-text={item.label} />
                  </td>
                  <td v-keep={item.id} class="col-md-1">
                    <a onclick={() => store.delete(item.id)}>
                      <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                    </a>
                  </td>
                  <td v-keep class="col-md-6" />
                </tr>
              );
            }}
          </tbody>
        </table>
      </div>
    </div>
  );
}

mount("body", App);
