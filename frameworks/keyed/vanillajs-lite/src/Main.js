const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = (dict => dict[Math.round(Math.random() * 1000) % dict.length]);
const label = (() =>`${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`);

const {cloneNode, insertBefore} = Node.prototype;

let ID = 1, rows = [], selection;
const ROW = Symbol(), ACTION = Symbol();
const [[table], [tbody], [trow], buttons] = 'table,tbody,#trow,button'
    .split(',').map(s => document.querySelectorAll(s));

const build = (TRow => () => {
    const tr = TRow();
    const td1 = tr.firstChild, td2 = td1.nextSibling, td3 = td2.nextSibling;
    const a1 = td2.firstChild, a2 = td3.firstChild;
    td1.firstChild.nodeValue = ID++;
    (tr.label = a1.firstChild).nodeValue = label();
    a1[ACTION] = select, a2[ACTION] = remove;
    return a1[ROW] = a2[ROW] = tr;
})(cloneNode.bind(trow.content.firstChild, true));

const insert = (insertBefore.bind(tbody));

const create = (count, old) => {
    !old && clear();
    const data = [];
    for (let i = 0; i < count; i++)
        data[i] = insert(build(), null);
    rows = [...(old ?? []), ...data];
};

const select = row => (selection && (selection.className = ''),
    (selection = row).className = 'danger');

const remove = row =>
    (row.remove(), (rows = new Set(rows)).delete(row), rows = [...rows]);

const clear = () => (rows.length && (tbody.textContent = ''),
    rows = [], selection = null);

buttons.forEach(function (b) { b.onclick = this[b.id]; }, {
    run () { create(1000); },
    runlots () { create(10000); },
    add () { create(1000, rows); },
    clear,
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

table.onclick = e => {
    let {target: t} = e;
    e.stopPropagation(), (t[ACTION] ?? (t = t.parentNode)[ACTION])?.(t[ROW]);
};
