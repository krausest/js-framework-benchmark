<script>
  import { rows, selectedId, run, runLots, add, update, clear, swapRows, removeRow, select } from './store.js';

  // nanostores atoms implement the Svelte store interface (subscribe returns unsubscribe),
  // so they can be used directly with the $ prefix in Svelte templates.
</script>

<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6"><h1>Astro Svelte Nano Stores keyed</h1></div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="run" onclick={run}>Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="runlots" onclick={runLots}>Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="add" onclick={add}>Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="update" onclick={update}>Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="clear" onclick={clear}>Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={swapRows}>Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody>
      {#each $rows as item (item.id)}
        <tr class={$selectedId === item.id ? 'danger' : ''}
          ><td class="col-md-1">{item.id}</td
          ><td class="col-md-4"><a onclick={() => select(item.id)}>{item.label}</a></td
          ><td class="col-md-1"><a onclick={() => removeRow(item.id)}><span class="glyphicon glyphicon-remove" aria-hidden="true" /></a></td
          ><td class="col-md-6" /></tr
        >
      {/each}
    </tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>
