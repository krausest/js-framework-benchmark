import { State, insert } from 'karyon';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const rows = State([]);
const selection = State();

const create = ((ID, $) => count => [...Array(count)].map(() =>
    Row(++ID, State(`${$(adjectives)} ${$(colours)} ${$(nouns)}`))
))(0, $ => $[Math.round(Math.random() * 1000) % $.length]);

const select = function () { selection(this.ID); };

const remove = (filter => function () {
    rows(rows().filter(filter, this.ID));
})(function (row) { return row?.ID !== this; });

const Row = (selected => (ID, text) =>
    ({is: 'tr', content: [
        {is: 'td', class: 'col-md-1', content: ID},
        {is: 'td', class: 'col-md-4', content:
            {is: 'a', action: select, content: text}},
        {is: 'td', class: 'col-md-1', content:
            {is: 'a', action: remove, content: Icon('')}},
        {is: 'td', class: 'col-md-6'}
    ], class: State.track(selection, ID, selected), ID, text})
)(on => on && 'danger');

const Icon = name =>
    ({is: 'span', attrs: {'aria-hidden': 'true'},
        class: `glyphicon glyphicon-remove ${name}`});

const actions = [
    ['Create 1,000 rows', 'run', () => rows(create(1000))],
    ['Create 10,000 rows', 'runlots', () => rows(create(10000))],
    ['Append 1,000 rows', 'add', () => rows([...rows(), ...create(1000)])],
    ['Clear', 'clear', () => rows([])],
    ['Update every 10th row', 'update', () => {
        for (let i = 0, all = rows(), row; i < all.length; i += 10)
            (row = all[i])?.text(`${row.text()} !!!`);
    }],
    ['Swap Rows', 'swaprows', () => {
        const all = rows();
        [all[1], all[998]] = [all[998], all[1]], rows([...all]);
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
        },
        {is: 'table', class: 'table table-hover table-striped test-data',
            content: {is: 'tbody', id: 'tbody', content: rows},
            listen: {click: (event, context) => context?.action?.()}},
        Icon('preloadicon')
    ]}
}, document.body);
