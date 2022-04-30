import { attribute, child, children, Component, h, onClick, sc2, text } from '@crui/core';
import { text$ } from '@crui/reactive/elems/text';
import { map } from '@crui/reactive/rx/box/map';
import { c$map } from '@crui/reactive/setups/map';
import { $props } from '@crui/reactive/setups/props';
import { Item, Store } from './store';
import { klass } from './utils';

export function Table(store: Store) {
    return h('table', sc2(
        klass('table table-hover table-striped test-data'),
        child(h('tbody', c$map(
            store.getData(),
            (item) => row(store, item)
        )))
    ))
}

const binIcon = h('span', sc2(
    klass('glyphicon glyphicon-remove'),
    attribute('aria-hidden', 'true')
))

function row(store: Store, item: Item) {
    const className = map(
        item.selected,
        (selected) => selected ? 'danger' : ''
    )
    return h('tr', sc2(
        $props({ className }),
        children([
            td('col-md-1', text(item.id.toString())),
            td('col-md-4', a(text$(item.label), () => {
                store.select(item)
            })),
            td('col-md-1', a(binIcon, () => {
                store.remove(item)
            })),
            h('td', klass('col-md-6'))
        ])
    ))
}

function td(cls: string, c: Component<{}, any>) {
    return h('td', sc2(
        klass(cls),
        child(c)
    ))
}

type Handler = () => void
function a(c: Component<{}, any>, click: Handler) {
    return h('a', sc2(
        onClick(click),
        child(c)
    ))
}