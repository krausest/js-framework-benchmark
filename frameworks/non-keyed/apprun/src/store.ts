import { Update } from 'apprun';

function _random(max: number) {
  return Math.round(Math.random() * 1000) % max;
}

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

export type Data = {
  id: number
  label: string
}

export type State = {
  data: Array<Data>;
  selected: number;
}

export type Events = 'run' | 'runlost' | 'add' | 'udate' | 'swaprows' | 'clear' | 'delete' | 'select';

export const state: State = {
  data: [],
  selected: 0
}

let id = 1
function buildData(count: number): Array<Data> {
  return new Array(count).fill(0).map(_ => ({
    id: id++,
    label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
  }))
}

export const update: Update<State, Events> = {
  run: () => ({
    data: buildData(1000),
    selected: 0
  }),

  add: state => ({
    data: state.data.concat(buildData(1000)),
    selected: state.selected,
  }),

  runlots: () => ({
    data: buildData(10000),
    selected: 0
  }),

  clear: () => ({
    data: [],
    selected: 0
  }),

  update: state => ({
    data: state.data.map((d, i) => {
      if (i % 10 === 0) {
        d.label = `${d.label} !!!`
      }
      return d
    }),
    selected: state.selected
  }),

  swaprows: state => {
    if (state.data.length > 4) {
      const idx = state.data.length - 2;
      const a = state.data[1];
      state.data[1] = state.data[idx];
      state.data[idx] = a;
    }
    return state;
  },

  select: (state, id) => {
    state.selected = id
  },

  delete: (state, id) => {
    state.selected === state.selected ? null : state.selected;
    state.data = state.data.filter(d => d.id != id);
  }
}
