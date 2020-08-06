import {Copy, createElement} from "@bikeshaving/crank";
import {renderer} from "@bikeshaving/crank/dom";

function random(max) { return Math.round(Math.random() * 1000) % max; }

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

function Button({id, title}) {
  return (
    <div class="col-sm-6 smallpad">
      <button type="button" class="btn btn-primary btn-block" id={id}>
        {title}
      </button>
    </div>
  );
}


function Jumbotron() {
  this.addEventListener("click", (ev) => {
    if (ev.target.tagName === "BUTTON") {
      switch (ev.target.id) {
        case "run":
          this.dispatchEvent(new CustomEvent("jsfb_set", {
            bubbles: true,
            detail: {amount: 1000},
          }));
          break;
        case "runlots":
          this.dispatchEvent(new CustomEvent("jsfb_set", {
            bubbles: true,
            detail: {amount: 10000},
          }));
          break;
        case "add":
          this.dispatchEvent(new CustomEvent("jsfb_add", {
            bubbles: true,
            detail: {amount: 1000},
          }));
          break;
        case "update":
          this.dispatchEvent(new Event("jsfb_update", {bubbles: true}));
          break;
        case "clear":
          this.dispatchEvent(new Event("jsfb_clear", {bubbles: true}));
          break;
        case "swaprows":
          this.dispatchEvent(new Event("jsfb_swap", {bubbles: true}));
          break;
      }
    }
  });

  return (
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Crank</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" title="Create 1,000 rows" />
            <Button id="runlots" title="Create 10,000 rows" />
            <Button id="add" title="Append 1,000 rows" />
            <Button id="update" title="Update every 10th row" />
            <Button id="clear" title="Clear" />
            <Button id="swaprows" title="Swap Rows" />
          </div>
        </div>
      </div>
    </div>
  );
}

function *Row({selected, item}) {
  const onselect = () => {
    this.dispatchEvent(new CustomEvent("jsfb_select", {
      bubbles: true,
      detail: {id: item.id},
    }));
  };

  const ondelete = () => {
    this.dispatchEvent(new CustomEvent("jsfb_remove", {
      bubbles: true,
      detail: {id: item.id},
    }));
  };

  let initial = true;
  for (const newProps of this) {
    if (
      initial ||
      selected !== newProps.selected ||
      item !== newProps.item
    ) {
      initial = false;
      selected = newProps.selected;
      item = newProps.item;
      yield (
        <tr class={selected ? "danger" : null}>
          <td class="col-md-1">{item.id}</td>
          <td class="col-md-4">
            <a onclick={onselect}>{item.label}</a>
          </td>
          <td class="col-md-1">
            <a onclick={ondelete}>
              <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
          </td>
          <td class="col-md-6" />
        </tr>
      );
    } else {
      yield <Copy />;
    }
  }
}

function *Main() {
  let data = [];
  let selected;
  this.addEventListener("jsfb_set", (ev) => {
    data = buildData(ev.detail.amount);
    this.refresh();
  });

  this.addEventListener("jsfb_add", (ev) => {
    data = data.concat(buildData(ev.detail.amount));
    this.refresh();
  });

  this.addEventListener("jsfb_update", (ev) => {
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      data[i] = {...item, label: data[i].label + " !!!"};
    }

    this.refresh();
  });

  this.addEventListener("jsfb_clear", () => {
    data = [];
    this.refresh();
  });

  this.addEventListener("jsfb_swap", () => {
    if (data.length > 998) {
      [data[1], data[998]] = [data[998], data[1]];
      this.refresh();
    }
  });

  this.addEventListener("jsfb_remove", (ev) => {
    const i = data.findIndex((item) => item.id === ev.detail.id);
    data.splice(i, 1);
    this.refresh();
  });

  this.addEventListener("jsfb_select", (ev) => {
    selected = ev.detail.id;
    this.refresh();
  });

  while (true) {
    yield (
      <div class="container">
        <Jumbotron />
        <table class="table table-hover table-striped test-data">
          <tbody>
            {data.map((item) => (
              <Row
                crank-key={item.id}
                item={item}
                selected={item.id === selected}
              />
            ))}
          </tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
      </div>
    );
  }
}

renderer.render(<Main />, document.getElementById("main"));
