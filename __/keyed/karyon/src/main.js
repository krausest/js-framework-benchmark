import { State, insert } from 'karyon';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

const rows = State([]);
const selection = State();

const create = ((ID, $) => count => [...Array(count)].map(() =>
    Row(++ID, `${$(adjectives)} ${$(colours)} ${$(nouns)}`)
))(0, $ => $[Math.round(Math.random() * 1000) % $.length]);

const select = row => selection(row.ID);

const remove = row => {
    const data = new Set(rows());
    data.delete(row) && rows([...data]);
};

const Row = (ID, label) => {
    const danger = State.track(selection, ID);
    const row = {is: 'tr', class: {danger}, ID, label: State(label)};
    row.content = [
        {is: 'td', class: 'col-md-1', content: ID},
        {is: 'td', class: 'col-md-4', content:
            {is: 'a', data: {action: select, row}, content: row.label}},
        {is: 'td', class: 'col-md-1', content:
            {is: 'a', data: {action: remove, row}, content: Icon()}},
        {is: 'td', class: 'col-md-6'}
    ];
    return row;
};

const Icon = (type = '') =>
    ({is: 'span', attrs: {'aria-hidden': 'true'},
        class: `glyphicon glyphicon-remove ${type}`});

const actions = [
    ['Create 1,000 rows', 'run', () => rows(create(1000))],
    ['Create 10,000 rows', 'runlots', () => rows(create(10000))],
    ['Append 1,000 rows', 'add', () => rows([...rows(), ...create(1000)])],
    ['Clear', 'clear', () => rows([])],
    ['Update every 10th row', 'update', () => {
        const data = rows();
        for (let i = 0, row; i < data.length; i += 10)
            (row = data[i])?.label(row.label() + ' !!!');
    }],
    ['Swap Rows', 'swaprows', () => {
        const data = rows();
        [data[1], data[998]] = [data[998], data[1]];
        rows([...data]);
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
            listen: {click: (e, {data}) => data?.action?.(data.row)}},
        Icon('preloadicon')
    ]}
}, document.body);
