
import domc from './domc.js'

var startTime;
var lastMeasure;

var startMeasure = function(name) {
    startTime = performance.now();
    lastMeasure = name;
};
var stopMeasure = function() {
    window.setTimeout(function() {
        var stop = performance.now();
        console.log(lastMeasure+" took "+(stop-startTime));
    }, 0);
};

let data = []
let did = 1

window.add = () => {
    // startMeasure("add");
    data = data.concat(buildData(1000))
    render()
    // stopMeasure();
}
window.run = () => {
    // startMeasure("run");
    data = buildData(1000)
    render()
    // stopMeasure();
}
window.runLots = () => {
    // startMeasure("runLots");
    data = buildData(10000)
    render()
    // stopMeasure();
}
window.clearData = () => {
    // startMeasure("clear");
    data = []
    render()
    // stopMeasure();
}
window.update = () => {
    // startMeasure("update");
    for (let i=0;i<data.length;i+=10) {
        data[i].label += ' !!!'
    }
    render()
    // stopMeasure();
}
window.swapRows = () => {
    // startMeasure("swapRows");
    if(data.length > 998) {
        var tmp = data[1];
        data[1] = data[998];
        data[998] = tmp;
    }
    render()
    // stopMeasure();
}

const del = item => {
    // startMeasure("delete");
    const id = item.id
    const idx = data.findIndex(d => d.id === id);
    data.splice(idx, 1)
    render()
    // stopMeasure();
}
const select = item => {
    // startMeasure("select");
    scope.selected = parseInt(item.id)
    render()
    // stopMeasure();
}
const rowClass = (id, selected) => {
    return id === selected ? "danger" : '';
}
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

const parent = document.querySelector('tbody')

let template = parent.firstElementChild
parent.removeChild(template)
template = domc.compile(template)

const scope = {rowClass, selected: 0, del, select}

let nodes = []

const render = () => {
    if (data.length === 0) {
        parent.textContent = ""
        nodes.length = data.length
        return
    }
    if (nodes.length > data.length) {
        for(let i = data.length; i < nodes.length; i++) {
            parent.removeChild(nodes[i].node)
        }
        nodes.length = data.length
    }
    const localScope = Object.assign({}, scope)
    for(let i = 0; i < data.length; i++) {
        localScope.item = data[i]
        if (nodes[i]) {
            nodes[i].update(localScope)
        } else {
            nodes[i] = template.createInstance(localScope)
            parent.appendChild(nodes[i].node)
        }
    }
}
