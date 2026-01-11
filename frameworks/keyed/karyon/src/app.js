import { State, insert } from 'karyon';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const rows = State([]), selection = State();

const create = ((ID, $) => count => [...Array(count)].map(() =>
    Row(++ID, State(`${$(adjectives)} ${$(colours)} ${$(nouns)}`))
))(0, $ => $[Math.round(Math.random() * 1000) % $.length]);

const select = function () { selection(this.ID); };

const remove = function () { rows(rows().filter(r => r?.ID !== this.ID)); };

State.on(selection, (i, o) => rows().forEach(({ID, class: $}) =>
    ID === i ? $('danger') : ID === o && $(null)));

const Row = (ID, text) => ({is: 'tr', content: [
    {is: 'td', class: 'col-md-1', content: ID},
    {is: 'td', class: 'col-md-4', content:
        {is: 'a', action: select, content: text}},
    {is: 'td', class: 'col-md-1', content:
        {is: 'a', action: remove, content: {is: 'span', attrs: icon}}},
    {is: 'td', class: 'col-md-6'}
], ID, text, class: State()});

const icon = {class: 'glyphicon glyphicon-remove', 'aria-hidden': 'true'};

const actions = [
    ['Create 1,000 rows', 'run', () => rows(create(1000))],
    ['Create 10,000 rows', 'runlots', () => rows(create(10000))],
    ['Append 1,000 rows', 'add', () => rows([...rows(), ...create(1000)])],
    ['Update every 10th row', 'update', () => {
        for (let r = rows(), t, i = 0; t = r[i]?.text; i += 10)
            t(t() + ' !!!');
    }],
    ['Clear', 'clear', () => rows([])],
    ['Swap Rows', 'swaprows', () => {
        const r = [...rows()];
        r[998] && ([r[1], r[998]] = [r[998], r[1]], rows(r));
    }]].map(([content, id, click]) =>
        ({class: 'col-sm-6 smallpad', content:
            {is: 'button', id, class: 'btn btn-primary btn-block',
                attrs: {type: 'button'}, listen: {click}, content}}));

insert({id: 'main', content:
    {class: 'container', content: [
        {class: 'jumbotron', content:
            {class: 'row', content: [
                {class: 'col-md-6', content:
                    {is: 'h1', content: document.title}},
                {class: 'col-md-6', content: {class: 'row', content: actions}}
            ]}
        }, {is: 'span', attrs: icon, class: {preloadicon: true}},
        {is: 'table', class: 'table table-hover table-striped test-data',
            content: {is: 'tbody', id: 'tbody', content: rows},
            listen: {click: (e, context) => context?.action?.()}}
    ]}
}, document.body);
