const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = dict => dict[Math.round(Math.random() * 1000) % dict.length];

let ID = 1, rows = [], selection;
const ROW = Symbol(), ACTION = Symbol();

const table = document.querySelector('table');
let tbody = document.querySelector('tbody');
const trow = document.querySelector('#trow');

const {cloneNode, insertBefore} = Node.prototype;
const TBody = (cloneNode.bind(tbody, false));
const TRow = (cloneNode.bind(trow.content.firstChild, true));
const insert = ((row, before = null) => insertBefore.call(tbody, row, before));

const build = (() => {
    const tr = TRow();
    const td1 = tr.firstChild, td2 = td1.nextSibling, td3 = td2.nextSibling;
    const a1 = td2.firstChild, a2 = td3.firstChild;
    const label = `${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;
    td1.firstChild.nodeValue = ID++;
    (tr.label = a1.firstChild).nodeValue = label;
    a1[ACTION] = select, a2[ACTION] = remove;
    return insert(a1[ROW] = a2[ROW] = tr);
});

const create = count => [...Array(count)].map(build);

const select = (set => row => {
    set('remove'), selection = row, set('add');
})(setter => selection?.classList[setter]('danger'));

const remove = (match => row => {
    rows = rows.filter(match, row), row.remove();
})(function (row) { return row !== this; });

const clear = patch => {
    rows = [], selection = null;
    const empty = !tbody.firstChild;
    if (!empty || patch)
        !empty && patch ? (tbody.textContent = '', patch()) :
            tbody.remove(), tbody = TBody(), patch?.(),
            insertBefore.call(table, tbody, null);
};

document.querySelectorAll('button').forEach(function (button) {
    button.addEventListener('click', this[button.id]);
}, {
    run () { clear(() => rows = create(1000)); },
    runlots () { clear(() => rows = create(10000)); },
    add () { rows = [...rows, ...create(1000)]; },
    clear () { clear(); },
    update () {
        for (let i = 0; i < rows.length; i += 10)
            rows[i].label.nodeValue += ' !!!';
    },
    swaprows () {
        if (rows.length > 998)
            insert(rows[1], rows[998]), insert(rows[998], rows[2]),
            [rows[1], rows[998]] = [rows[998], rows[1]];
    }
});

table.addEventListener('click', e => {
    let {target: t} = e;
    e.stopPropagation(), (t[ACTION] ?? (t = t.parentNode)[ACTION])?.(t[ROW]);
});
