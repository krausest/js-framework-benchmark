export default async (e, method) => {
  window.rowId = window.rowId ?? 1;
  const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

  function _random (max) { return Math.round(Math.random() * 1000) % max; };

  function buildData(count) {
    let data = [];
    for (let i = 0; i < count; i++) {
      data.push({id: rowId++, label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`});
    }
    return data;
  }

  const methods = {
    run: () => tpl.replace('bench', buildData(1000)),
    runLots: () => tpl.replace('bench', buildData(10000)),
    add: () => tpl.add('bench', buildData(1000)),
    clear: () => tpl.remove('bench'),
    remove: () => tpl.remove('bench', e.it),
    swapRows: () => tpl.swap('bench', 1, 998),
    update: () => tpl.set('bench', {label: '${label} !!!'}, {id: /^(\d*1)$/}),
    select: () => {
      $('.danger')?.cls.remove('danger');
      tpl.pos(e.it, (e) => {e?.field?.cls.add('danger')});
    }
  };

  methods[method]();
}