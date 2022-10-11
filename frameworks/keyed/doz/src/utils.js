'use strict';
const _random = (max) => {
    return Math.round(Math.random() * 1000) % max;
};
const updateData = (data, mod = 10) => {
    const newData = [...data];
    for (let i = 0; i < newData.length; i += 10) {
        newData[i] = Object.assign({}, newData[i], {label: newData[i].label + ' !!!'});
    }
    return newData
};
const buildData = (id, count = 1000) => {
    const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    const data = [];
    for (let i = 0; i < count; i++)
        data.push({
            id: id++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    return {data, id};
};

module.exports = {
    add(id, data) {
        const newData = buildData(id, 1000);
        return {data: [...data, ...newData.data], id: newData.id};
    },
    run(id) {
        console.time(this.currentBench = 'run');
        this.getStore('list').rows = buildData(id).data;
    },
    runLots(id) {
        return buildData(id, 10000);
    },
    update(data) {
        return updateData(data);
    },
    swapRows(data) {
        const newData = [...data];
        if (newData.length > 998) {
            let temp = newData[1];
            newData[1] = newData[998];
            newData[998] = temp;
        }
        return newData;
    },
    deleteRow(data, id) {
        return data.filter(d => {
            return d.id !== id
        });
    }
};