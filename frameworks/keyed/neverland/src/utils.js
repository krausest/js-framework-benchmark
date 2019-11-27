let did = 1;
const buildData = (count) => {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
};

const _random = max => Math.round(Math.random() * 1000) % max;

export const Scope = () => ({
  data: [],
  selected: -1,
  add() {
      this.data = this.data.concat(buildData(1000));
  },
  run() {
      this.data = buildData(1000);
  },
  runLots() {
      this.data = buildData(10000);
  },
  clear() {
      this.data = [];
  },
  update() {
      const {data} = this;
      for (let i = 0, {length} = data; i < length; i += 10)
          data[i].label += ' !!!';
  },
  swapRows() {
      const {data} = this;
      if (data.length > 998) {
          const tmp = data[1];
          data[1] = data[998];
          data[998] = tmp;
      }
  },
  delete(id) {
      const {data} = this;
      const idx = data.findIndex(d => d.id === id);
      data.splice(idx, 1);
  },
  select(id) {
      this.selected = id;
  },
});

export const listReducer = (state, action) => {
  const {type} = action;
  switch (type) {
    case 'delete':
    case 'select':
      state[type](action.id);
      break;
    default:
      state[type]();
      break;
  }
  return {...state};
};
