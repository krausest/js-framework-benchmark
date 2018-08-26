
import domc from 'domc'
import '../node_modules/domc/vFor.js'

let did = 1
const buildData = (count) => {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
}
const _random = (max) => {
    return Math.round(Math.random() * 1000) % max;
}

const scope = {
    add: () => {
        scope.data = scope.data.concat(buildData(1000))
        main.update(scope)
    },
    run: () => {
        scope.data = buildData(1000)
        main.update(scope)
    },
    runLots: () => {
        scope.data = buildData(10000)
        main.update(scope)
    },
    clearData: () => {
        scope.data = []
        main.update(scope)
    },
    update: () => {
        const data = scope.data
        for (let i=0;i<data.length;i+=10) {
            data[i].label += ' !!!'
        }
        main.update(scope)
    },
    swapRows: () => {
        const data = scope.data
        if(data.length > 998) {
            var tmp = data[1];
            data[1] = data[998];
            data[998] = tmp;
        }

        main.update(scope)
    },
    del: item => {
        const id = item.id
        const data = scope.data
        const idx = data.findIndex(d => d.id === id);
        data.splice(idx, 1)
        main.update(scope)
    },
    select: item => {
        scope.selected = parseInt(item.id)
        main.update(scope)
    },
    selected: 0,
    data: [],
}

const main = document.getElementById('main')
const app = domc(main)
app.rehydrate(scope)
