import { attribute, h, sc2 } from '@crui/core';
import { Jumbotron } from './jumbotron';
import { Store } from './store';
import { Table } from './table';
import { div, klass } from './utils';

const loading = h('span', sc2(
    klass('preloadicon glyphicon glyphicon-remove'),
    attribute('aria-hidden', 'true'),
))

export function App(store: Store) {
    return div('container', [
        Jumbotron(store),
        Table(store),
        loading,
    ])
}