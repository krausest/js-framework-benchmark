<div class="jumbotron">
  <div class="row">
    <div class="col-md-6">
      <h1>Svelte (keyed)</h1>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="run" on:click={run}>Create 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="runlots" on:click={runLots}>Create 10,000
            rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="add" on:click={add}>Append 1,000 rows</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="update" on:click={partialUpdate}>Update every
            10th row</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="clear" on:click={clear}>Clear</button>
        </div>
        <div class="col-sm-6 smallpad">
          <button type="button" class="btn btn-primary btn-block" id="swaprows" on:click={swapRows}>Swap Rows</button>
        </div>
      </div>
    </div>
  </div>
</div>
<table class="table table-hover table-striped test-data">
  <tbody>
    {#each data as row, num (row.id)}
      <tr class={selected === row.id ? 'danger' : ''}>
        <td class="col-md-1">{row.id}</td>
        <td class="col-md-4">
          <a on:click={() => select(row.id)}>{row.label}</a>
        </td>
        <td class="col-md-1"><a on:click={() => remove(row.id)}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
        <td class="col-md-6"></td>
      </tr>
    {/each}
  </tbody>
</table>
<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>

<script>
  let rowId = 1,
    data = [],
    selected = undefined;

  const add = () => data = data.concat(buildData(1000)),
    clear = () => {
      data = [];
      selected = undefined;
    },
    partialUpdate = () => {
      for (let i = 0; i < data.length; i += 10) {
        data[i].label += ' !!!';
      }
    },
    remove = (num) => {
      const idx = data.findIndex(d => d.id === num);
      data = [...data.slice(0, idx), ...data.slice(idx + 1)];
    },
    run = () => {
      data = buildData(1000);
      selected = undefined;
    },
    runLots = () => {
      data = buildData(10000);
      selected = undefined;
    },
    select = (id) => selected = id,
    swapRows = () => {
      if (data.length > 998) {
        data = [data[0], data[998], ...data.slice(2, 998), data[1], data[999]];
      }
    };

  function _random (max) { return Math.round(Math.random() * 1000) % max; };

  function buildData(count = 1000) {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
      colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
      nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"],
      data = new Array(count);
    for (var i = 0; i < count; i++)
      data[i] = { id: rowId++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] };
    return data;
  }
</script>
