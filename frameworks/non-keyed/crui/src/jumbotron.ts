import { Component, ctext, h, ht, onClick, props, sc } from '@crui/core';
import { Store } from './store';
import { div } from './utils';

export function Jumbotron(store: Store) {
    return div('jumbotron', [
        row([
            col6(ht('h1', 'CRUI')),
            col6(row([
                button('run', 'Create 1,000 rows', store.set1k),
                button('runlots', 'Create 10,000 rows', store.set10k),
                button('add', 'Append 1,000 rows', store.add1k),
                button('update', 'Update every 10th row', store.updateEvery10th),
                button('clear', 'Clear', store.clear),
                button('swaprows', 'Swap Rows', store.swapRows),
            ]))
        ])
    ])
}

function row(cs: Component[]) {
    return div('row', cs)
}

function col6(c: Component) {
    return div('col-md-6', [c])
}

type Handler = () => void
function button(id: string, text: string, click: Handler) {
    return div('col-sm-6 smallpad', [
        h('button', sc([
            props({ id, className: 'btn btn-primary btn-block', type: 'button' }),
            onClick(click),
            ctext(text)
        ]))
    ])
}