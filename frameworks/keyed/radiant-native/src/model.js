const adjectives = ['pretty','large','big','small','tall','short','long','handsome','plain','quaint','clean','elegant','easy','angry','crazy','helpful','mushy','odd','unsightly','adorable','important','inexpensive','cheap','expensive','fancy'];
const colors = ['red','yellow','blue','green','pink','brown','purple','brown','white','black','orange'];
const nouns = ['table','chair','house','bbq','desk','car','pony','cookie','sandwich','burger','pizza','mouse','keyboard'];
const random = max => Math.round(Math.random() * 1000) % max;
let nextId = 1;
const buildData = count => Array.from({ length: count }, () => ({ id: nextId++, label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}` }));
export class Model {
  rows = [];
  selected = null;
  constructor(changed) { this.changed = changed; }
  run() { this.rows = buildData(1000); this.changed(); }
  runlots() { this.rows = buildData(10000); this.changed(); }
  add() { this.rows = [...this.rows, ...buildData(1000)]; this.changed(); }
  update() { this.rows = this.rows.map((row, i) => i % 10 === 0 ? { ...row, label: `${row.label} !!!` } : row); this.changed(); }
  clear() { this.rows = []; this.changed(); }
  swaprows() { if (this.rows.length > 998) { this.rows = this.rows.slice(); [this.rows[1], this.rows[998]] = [this.rows[998], this.rows[1]]; this.changed(); } }
  select(id) { this.selected = id; this.changed(); }
  remove(id) { this.rows = this.rows.filter(row => row.id !== id); this.changed(); }
}
export const buttons = [['run','Create 1,000 rows'],['runlots','Create 10,000 rows'],['add','Append 1,000 rows'],['update','Update every 10th row'],['clear','Clear'],['swaprows','Swap Rows']];
