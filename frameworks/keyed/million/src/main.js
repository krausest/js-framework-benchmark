import {
  Block,
  fragment,
  stringToDOM,
  withKey,
  createCache,
} from '/Users/aidenybai/Projects/aidenybai/million/packages/block/index';

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
const colors = [
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

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
let list = [];
let selected = 0;
let main;

const clear = () => {
  list = [];
  main.remove();
};

const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; ++i) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${
        colors[random(colors.length)]
      } ${nouns[random(nouns.length)]}`,
    };
  }
  return data;
};

const create1k = () => {
  if (list.length) clear();
  list = buildData(1000);
  update();
  return false;
};

const create10k = () => {
  if (list.length) clear();
  list = buildData(10000);
  update();
  return false;
};

const append1k = () => {
  list = list.concat(buildData(1000));
  update();
  return false;
};

const updateEvery10 = () => {
  let i = 0;
  while (i < list.length) {
    list[i].label = `${list[i].label} !!!`;
    i += 10;
  }
  update();
  return false;
};

const swapRows = () => {
  if (list.length > 998) {
    const item = list[1];
    list[1] = list[998];
    list[998] = item;
  }
  update();
  return false;
};

const select = (id) => {
  selected = id;
  update();
};

const remove = (id) => {
  list.splice(
    list.findIndex((item) => item.id === id),
    1
  );
  update();
};

const Row = (() => {
  const root = stringToDOM(
    '<tr><td class="col-md-1"></td><td class="col-md-4"><a></a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>'
  );
  const edits = [
    {
      path: [0],
      edits: [
        {
          type: 'child',
          hole: 'id',
          index: 0,
        },
      ],
      inits: [],
    },
    {
      path: [1, 0],
      edits: [
        {
          type: 'event',
          listener: 'select',
          name: 'onClick',
          hole: 'select',
        },
        {
          type: 'child',
          hole: 'label',
          index: 0,
        },
      ],
      inits: [],
    },
    {
      path: [2, 0],
      edits: [
        {
          type: 'event',
          listener: 'remove',
          name: 'onClick',
          hole: 'remove',
        },
      ],
      inits: [],
    },
    {
      path: [],
      edits: [
        {
          type: 'attribute',
          hole: 'className',
          name: 'class',
        },
      ],
      inits: [],
    },
  ];
  const shouldUpdate = (oldProps, newProps) => {
    return (
      oldProps.label !== newProps.label ||
      oldProps.className !== newProps.className
    );
  };
  return (props, key) => {
    return new Block(root, edits, props, key, shouldUpdate);
  };
})();

function render(oldCache, newCache) {
  return fragment(
    list.map((item) => {
      const isSelected = selected === item.id;
      const id = String(item.id);
      const cachedItem = oldCache[item.id];
      if (cachedItem) {
        if (
          cachedItem.memo[0] === item.label &&
          cachedItem.memo[1] === isSelected
        ) {
          return (newCache[item.id] = cachedItem);
        }
      }

      const row = Row(
        {
          id: item.id,
          label: item.label,
          className: isSelected ? 'danger' : '',
          remove: withKey(() => {
            remove(item.id);
            return false;
          }, id),
          select: withKey(() => {
            select(item.id);
            return false;
          }, id),
        },
        id,
        false
      );
      row.memo = [item.label, isSelected];
      newCache[item.id] = row;
      return row;
    })
  );
}

new Block(
  stringToDOM(
    '<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Million</h1></div><div class="col-md-6"><div class="row"><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="run">Create 1,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="add">Append 1,000 rows</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="update">Update every 10th row</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="clear">Clear</button></div><div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="swaprows">Swap Rows</button></div></div></div></div></div><table class="table table-hover table-striped test-data"><tbody></tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>'
  ),
  [
    {
      path: [0, 0, 1, 0, 0, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: create1k,
        },
      ],
      inits: [],
    },
    {
      path: [0, 0, 1, 0, 1, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: create10k,
        },
      ],
      inits: [],
    },
    {
      path: [0, 0, 1, 0, 2, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: append1k,
        },
      ],
      inits: [],
    },
    {
      path: [0, 0, 1, 0, 3, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: updateEvery10,
        },
      ],
      inits: [],
    },
    {
      path: [0, 0, 1, 0, 4, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: () => {
            clear();
            update();
            return false;
          },
        },
      ],
      inits: [],
    },
    {
      path: [0, 0, 1, 0, 5, 0],
      edits: [
        {
          type: 'event',
          name: 'onClick',
          listener: swapRows,
        },
      ],
      inits: [],
    },
    {
      path: [1, 0],
      edits: [
        {
          type: 'child',
          hole: 'rows',
          index: 0,
        },
      ],
      inits: [],
    },
  ],
  { rows: (main = fragment([])) },
  undefined,
  undefined
).mount(document.getElementById('main'));

let oldCache = {};
function update() {
  let newCache = {};
  main.patch(render(oldCache, newCache));
  oldCache = newCache;
}

const cache = createCache();
cache.set('foo', { foo: 'bar' });
setInterval(() => {
  cache.set('foo', { foo: String(Math.random()) });
}, 1);
console.log(cache.get('foo'));
