
export function Page() {
  let rowId = 1;
  let $data: any = [];
  let $selected = -1;

  const add = () => {
      $data.push(...buildData(1000));
    },
    clear = () => {
      $data = [];
    },
    partialUpdate = () => {
      for (let i = 0; i < $data.length; i += 10) {
        $data[i].$label += " !!!";
      }
    },
    run = () => {
      $data = buildData(1000);
    },
    select = (id) => {
      $selected = id;
    },
    runLots = () => {
      $data = buildData(10000);
    },
    swapRows = () => {
      if ($data.length > 998) {
        $data = swapElements($data.getValue(), 1, 998);
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
            <h1>Rezact (keyed)</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" onClick={run}>
                Create 1,000 rows
              </Button>
              <Button id="runlots" onClick={runLots}>
                Create 10,000 rows
              </Button>
              <Button id="add" onClick={add}>
                Append 1,000 rows
              </Button>
              <Button id="update" onClick={partialUpdate}>
                Update every 10th row
              </Button>
              <Button id="clear" onClick={clear}>
                Clear
              </Button>
              <Button id="swaprows" onClick={swapRows}>
                Swap Rows
              </Button>
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          {$data.map(($row) => {
            const id = $row.id;
            return (
              <tr class={$selected === id ? "danger" : ""}>
                <td class="col-md-1">{id}</td>
                <td class="col-md-4">
                  <a onClick={() => select(id)}>{$row.$label}</a>
                </td>
                <td class="col-md-1">
                  <a onClick={() => $data.deleteValue($row)}>
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

function Button(props) {
  return (
    <div class="col-sm-6 smallpad">
      <button
        type="button"
        class="btn btn-primary btn-block"
        id={props.id}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
}
