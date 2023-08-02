import { xCreateElement, xFragment } from "src/lib/rezact/rezact";

export function Page() {
  let rowId = 1;
  let $data: any = [];
  let $selected = -1;

  const add = () => {
      // const start = performance.now();
      $data = $data.concat(buildData(1000));
      // $perfTime = performance.now() - start;
    },
    clear = () => {
      // const start = performance.now();
      $data = [];
      // $perfTime = performance.now() - start;
    },
    partialUpdate = () => {
      // const start = performance.now();
      for (let i = 0; i < $data.length; i += 10) {
        $data[i].$label += " !!!";
      }
      // $perfTime = performance.now() - start;
    },
    run = () => {
      // const start = performance.now();
      $data = buildData(1000);
      // $perfTime = performance.now() - start;
    },
    select = (id) => {
      // const start = performance.now();
      $selected = id;
      // $perfTime = performance.now() - start;
    },
    runLots = () => {
      // const start = performance.now();
      $data = buildData(10000);
      // $perfTime = performance.now() - start;
    },
    swapRows = () => {
      if ($data.length > 998) {
        // const start = performance.now();
        $data = swapElements($data.v, 1, 998);
        // $perfTime = performance.now() - start;
      }
    };

  const swapElements = (arr, index1, index2) => {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
    return arr;
  };

  function _random(max) {
    return Math.round(Math.random() * 1000) % max;
  }

  function buildData(count = 1000) {
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
      ],
      colours = [
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
      ],
      nouns = [
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
      ],
      data = new Array(count);
    for (var i = 0; i < count; i++)
      data[i] = {
        id: rowId++,
        $label:
          adjectives[_random(adjectives.length)] +
          " " +
          colours[_random(colours.length)] +
          " " +
          nouns[_random(nouns.length)],
      };
    return data;
  }

  return (
    <>
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Rezact-"keyed"</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="run"
                  onClick={run}
                >
                  Create 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="runlots"
                  onClick={runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="add"
                  onClick={add}
                >
                  Append 1,000 rows
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="update"
                  onClick={partialUpdate}
                >
                  Update every 10th row
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="clear"
                  onClick={clear}
                >
                  Clear
                </button>
              </div>
              <div class="col-sm-6 smallpad">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  id="swaprows"
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {$data.map(($row) => {
            return (
              <tr class={$selected === $row.id ? "danger" : ""}>
                <td class="col-md-1">{$row.id}</td>
                <td class="col-md-4">
                  <a onClick={() => select($row.id)}>{$row.$label}</a>
                </td>
                <td class="col-md-1">
                  <a
                    onClick={() => {
                      // const start = performance.now();
                      $data.deleteValue($row);
                      // $perfTime = performance.now() - start;
                    }}
                  >
                    <span
                      class="glyphicon glyphicon-remove"
                      aria-hidden="true"
                    />
                  </a>
                </td>
                <td class="col-md-6" />
              </tr>
            );
          })}
        </tbody>
      </table>
      <span
        class="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </>
  );
}
