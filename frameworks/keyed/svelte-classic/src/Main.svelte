<svelte:options immutable />

<script>
  let rowId = 1;
  let data = [];
  let selected = undefined;
  const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ];
  const colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ];
  const nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];
  const add = () => (data = [...data, ...buildData(1000)]),
    clear = () => {
      data = [];
    },
    partialUpdate = () => {
      const clone = data.slice();
      for (let i = 0; i < data.length; i += 10) {
        clone[i].label += " !!!";
      }
      data = clone;
    },
    remove = (row) => {
      const clone = data.slice();
      clone.splice(clone.indexOf(row), 1);
      data = clone;
    },
    run = () => {
      data = buildData(1000);
    },
    runLots = () => {
      data = buildData(10000);
    },
    swapRows = () => {
      if (data.length > 998) {
        const clone = data.slice();
        const tmp = clone[1];
        clone[1] = data[998];
        clone[998] = tmp;
        data = clone;
      }
    };
  function _random(max) {
    return Math.round(Math.random() * 1000) % max;
  }
  function createItem() {
    let label = `${adjectives[_random(adjectives.length)]} ${
      colours[_random(colours.length)]
    } ${nouns[_random(nouns.length)]}`;
    return {
      id: rowId++,
      label,
    };
  }
  function buildData(count = 1000) {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
      data[i] = createItem();
    }
    return data;
  }
</script>

<div class="jumbotron">
  <div class="row">
    <div class="col-md-6">
      <h1>Svelte Classic (keyed)</h1>
    </div>
    <div class="col-md-6">
      <div class="row">
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="run"
            on:click={run}>Create 1,000 rows</button
          >
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="runlots"
            on:click={runLots}>Create 10,000 rows</button
          >
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="add"
            on:click={add}>Append 1,000 rows</button
          >
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="update"
            on:click={partialUpdate}>Update every 10th row</button
          >
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="clear"
            on:click={clear}>Clear</button
          >
        </div>
        <div class="col-sm-6 smallpad">
          <button
            type="button"
            class="btn btn-primary btn-block"
            id="swaprows"
            on:click={swapRows}>Swap Rows</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
<table class="table table-hover table-striped test-data">
  <tbody>
    {#each data as row (row.id)}
      <tr class={selected === row.id ? "danger" : ""}
        ><td class="col-md-1">{row.id}</td><td class="col-md-4"
          ><a on:click={() => (selected = row.id)}>{row.label}</a></td
        ><td class="col-md-1"
          ><a on:click={() => remove(row)}
            ><span class="glyphicon glyphicon-remove" aria-hidden="true" /></a
          ></td
        ><td class="col-md-6" /></tr
      >
    {/each}
  </tbody>
</table>
<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />