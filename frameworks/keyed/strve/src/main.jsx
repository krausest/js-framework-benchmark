import { setData, createApp, registerComponent } from 'strve-js';

const adjectives = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
];
const colours = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
];
const nouns = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
];

let data = [];
let did = 1;
let selected = -1;
const TbodyComponentName = registerComponent('TbodyComponentName');

const add = () => {
  setData(() => {
    data = data.concat(buildData(1000));
  }, [TbodyComponentName, TbodyComponent]);
};

const run = () => {
  setData(() => {
    data = buildData(1000);
  }, [TbodyComponentName, TbodyComponent]);
};

const runLots = () => {
  setData(() => {
    data = buildData(10000);
  }, [TbodyComponentName, TbodyComponent]);
};

const clear = () => {
  setData(() => {
    data = [];
  }, [TbodyComponentName, TbodyComponent]);
};

const interact = (event) => {
  const el = event.target;
  const tr = el.closest('tr');
  const id = Number(tr.firstChild.textContent);
  if (el.matches('.glyphicon-remove')) {
    remove(id);
  } else {
    select(id);
  }
};

const remove = (id) => {
  const idx = data.findIndex((d) => d.id === id);
  setData(() => {
    data = [...data.slice(0, idx), ...data.slice(idx + 1)];
  }, [TbodyComponentName, TbodyComponent]);
};

const select = (id) => {
  setData(() => {
    if (selected > -1) {
      data[selected].selected = false;
    }
    selected = data.findIndex((d) => d.id === id);
    data[selected].selected = true;
  }, [TbodyComponentName, TbodyComponent]);
};

const swapRows = () => {
  setData(() => {
    if (data.length > 998) {
      const tmp = data[1];
      data[1] = data[998];
      data[998] = tmp;
    }
  }, [TbodyComponentName, TbodyComponent]);
};

const update = () => {
  setData(() => {
    for (let i = 0; i < data.length; i += 10) {
      data[i].label += ' !!!';
    }
  }, [TbodyComponentName, TbodyComponent]);
};

const _random = (max) => Math.round(Math.random() * 1000) % max;

const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: did++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${
        nouns[_random(nouns.length)]
      }`,
      selected: false,
    };
  }
  return data;
};

function TbodyComponent() {
  return (
    <tbody onClick={interact}>
      {data.map((item) => (
        <tr key={item.id} class={item.selected ? 'danger' : ''}>
          <td class='col-md-1'>{item.id}</td>
          <td class='col-md-4'>
            <a>{item.label}</a>
          </td>
          <td class='col-md-1'>
            <a>
              <span class='glyphicon glyphicon-remove' aria-hidden='true'></span>
            </a>
          </td>
          <td class='col-md-6'></td>
        </tr>
      ))}
    </tbody>
  );
}

function MainBody() {
  return (
    <fragment>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>Strve-keyed</h1>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='run' onClick={run}>
                  Create 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='runlots'
                  onClick={runLots}
                >
                  Create 10,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='add' onClick={add}>
                  Append 1,000 rows
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='update'
                  onClick={update}
                >
                  Update every 10th row
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button type='button' class='btn btn-primary btn-block' id='clear' onClick={clear}>
                  Clear
                </button>
              </div>
              <div class='col-sm-6 smallpad'>
                <button
                  type='button'
                  class='btn btn-primary btn-block'
                  id='swaprows'
                  onClick={swapRows}
                >
                  Swap Rows
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class='table table-hover table-striped test-data'>
        <component $name={TbodyComponentName}>{TbodyComponent()}</component>
      </table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
    </fragment>
  );
}

createApp(() => MainBody()).mount('#main');
