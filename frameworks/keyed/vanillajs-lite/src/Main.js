const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

const pick = dict => dict[Math.round(Math.random() * 1000) % dict.length];
const label = () =>`${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`;
const labelOf = r => r.firstChild.nextSibling.firstChild.firstChild;

const [[table], [tbody], [trow], buttons] = 'table,tbody,#trow,button'
    .split(',').map(s => document.querySelectorAll(s));
const {children: rows} = tbody;

const {cloneNode, insertBefore} = Node.prototype;
const clone = n => cloneNode.call(n, true);
const insert = insertBefore.bind(tbody);

let ID = 1, SEL, TMPL, SIZE;

const create = (count, add) => {
    if (SIZE !== count)
        TMPL = clone(trow.content), [...Array((SIZE = count) / 50 - 1)]
            .forEach(() => TMPL.appendChild(clone(TMPL.firstChild)));
    !add && (clear(), tbody.remove());
    while (count) {
        for (let r of TMPL.children)
            (r.$id ??= r.firstChild.firstChild).nodeValue = ID++,
            (r.$label ??= labelOf(r)).nodeValue = label(), count--;
        insert(clone(TMPL), null);
    }
    !add && table.appendChild(tbody);
};

const clear = () => (tbody.textContent = '', SEL = null);

buttons.forEach(function (b) { b.onclick = this[b.id]; }, {
    run () { create(1000); },
    runlots () { create(10000); },
    add () { create(1000, true); },
    clear,
    update () {
        for (let i = 0; i < rows.length; i += 10)
            labelOf(rows[i]).nodeValue += ' !!!';
    },
    swaprows () {
        const [, r1, r2] = rows, r998 = rows[998];
        r998 && (insert(r1, r998), insert(r998, r2));
    }
});

tbody.onclick = e => {
    const t = e.target, r = t.closest('tr');
    const td2 = r?.firstChild.nextSibling, td3 = td2?.nextSibling;
    e.stopPropagation();
    t === td2?.firstChild ?
        (SEL && (SEL.className = ''), (SEL = r).className = 'danger') :
    (t === td3?.firstChild || t === td3?.firstChild.firstChild) && r.remove();
};
