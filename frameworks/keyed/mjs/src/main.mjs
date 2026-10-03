<style>
  :host
    display: block
</style>

<script lang="js">
  const adjectives = ['pretty','large','big','small','tall','short','long','handsome','plain','quaint','clean','elegant','easy','angry','crazy','helpful','mushy','odd','unsightly','adorable','important','inexpensive','cheap','expensive','fancy'];
  const colours = ['red','yellow','blue','green','pink','brown','purple','brown','white','black','orange'];
  const nouns = ['table','chair','house','bbq','desk','car','pony','cookie','sandwich','burger','pizza','mouse','keyboard'];

  let rowId = 1;
  function _random(max) { return Math.round(Math.random() * 1000) % max; }
  function buildData(count) {
    const arr = new Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = µ.raw({
        id: rowId++,
        label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)]
      });
    }
    return µ.raw(arr);
  }

  // Helper hors path-tracking : copy + mutation locales, dehors du scope $-tracké.
  // Utilise des params nommés non-$ pour ne PAS être détecté comme alias.
  function _swapInPlace(src, i, j) {
    const out = new Array(src.length);
    for (let k = 0; k < src.length; k++) out[k] = src[k];
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
    return µ.raw(out);
  }
  function _removeAt(src, idx) {
    const out = new Array(src.length - 1);
    for (let k = 0; k < idx; k++) out[k] = src[k];
    for (let k = idx + 1; k < src.length; k++) out[k - 1] = src[k];
    return µ.raw(out);
  }
  function _patchEvery10th(src) {
    // Crée des nouveaux objets pour les rows mises à jour, conserve les autres.
    const out = new Array(src.length);
    for (let k = 0; k < src.length; k++) {
      if (k % 10 === 0) {
        out[k] = µ.raw({ id: src[k].id, label: src[k].label + ' !!!' });
      } else {
        out[k] = src[k];
      }
    }
    return µ.raw(out);
  }

  $data = µ.raw([]);
  $selected = -1;

  @run = function() { $data = buildData(1000); };
  @runlots = function() { $data = buildData(10000); };
  @add = function() { $data = µ.raw([...$data, ...buildData(1000)]); };
  @update = function() { $data = _patchEvery10th($data); };
  @clear = function() { $data = µ.raw([]); };
  @swaprows = function() {
    if ($data.length > 998) $data = _swapInPlace($data, 1, 998);
  };
  @select = function(id) { $selected = id; };
  @remove = function(id) {
    let idx = -1;
    for (let k = 0; k < $data.length; k++) {
      if ($data[k].id === id) { idx = k; break; }
    }
    if (idx !== -1) $data = _removeAt($data, idx);
  };
</script>

<div id="main" class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6"><h1>ModularJS V2 (keyed)</h1></div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="run" @click={@run()}>Create 1,000 rows</button></div>
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="runlots" @click={@runlots()}>Create 10,000 rows</button></div>
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="add" @click={@add()}>Append 1,000 rows</button></div>
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="update" @click={@update()}>Update every 10th row</button></div>
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="clear" @click={@clear()}>Clear</button></div>
          <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="swaprows" @click={@swaprows()}>Swap Rows</button></div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody>
      {for row in $data by id}
        <tr @class{$selected === row.id}="danger">
          <td class="col-md-1">{row.id}</td>
          <td class="col-md-4"><a @click={@select(row.id)}>{row.label}</a></td>
          <td class="col-md-1"><a @click={@remove(row.id)}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
          <td class="col-md-6"></td>
        </tr>
      {end}
    </tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>
