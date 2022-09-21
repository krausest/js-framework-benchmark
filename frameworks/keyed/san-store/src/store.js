import {Store, connect} from 'san-store';
import {builder} from 'san-update';

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
    'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important',
    'inexpensive', 'cheap', 'expensive', 'fancy'];
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza',
    'mouse', 'keyboard'];

const random = max => Math.round(Math.random() * 1000) % max;

let nextId = 1;
function buildData(count = 1000) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
        });
    }
    return data;
}

const store = new Store({
    initData: {
        rows: [],
        selected: 0
    },

    actions: {
        setSelected(id) {
            return builder().set('selected', id);
        },
        run(n, {dispatch}) {
            dispatch('setSelected', 0);
            return builder().set('rows', buildData(n));
        },
        add(n, {getState}) {
            const rows = getState('rows');
            return builder().set('rows', rows.concat(buildData(n)));
        },
        update(n, {getState}) {
            const newData = getState('rows').slice();
            for (let i = 0; i < newData.length; i += 10) {
                const r = newData[i];
                newData[i] = {id: r.id, label: r.label + ' !!!'};
            }
            return builder().set('rows', newData);
        },
        clear(n, {dispatch}) {
            dispatch('setSelected', 0);
            return builder().set('rows', []);
        },
        remove(id, {getState}) {
            const newData = getState('rows').slice();
            const idx = newData.findIndex(d => d.id === id);

            newData.splice(idx, 1);
            return builder().set('rows', newData);
        },
        swapRows(n, {getState}) {
            const newData = getState('rows').slice();
            if (newData.length > 998) {
                const tmp = newData[1];
                newData[1] = newData[998];
                newData[998] = tmp;
                return builder().set('rows', newData);
            }
        }
    }
});

export let connectSan = connect.createConnector(store);
