import { fdValue } from 'faster-dom'

let id = 1;

const rand = Math.random

function buildData(count) {
    const adjectives = [
        "pretty",
        "large",
        "big",
        "small",
        "tall",
        "short",
        "long",
        "handsome",
        "plain",
        "quaint",
        "clean",
        "elegant",
        "easy",
        "angry",
        "crazy",
        "helpful",
        "mushy",
        "odd",
        "unsightly",
        "adorable",
        "important",
        "inexpensive",
        "cheap",
        "expensive",
        "fancy",
    ]

    const colours = [
        "red",
        "yellow",
        "blue",
        "green",
        "pink",
        "brown",
        "purple",
        "brown",
        "white",
        "black",
        "orange",
    ]

    const nouns = [
        "table",
        "chair",
        "house",
        "bbq",
        "desk",
        "car",
        "pony",
        "cookie",
        "sandwich",
        "burger",
        "pizza",
        "mouse",
        "keyboard",
    ]

    const arr = [];
    for(let i = 0; i<count; i ++) {
        arr.push({
            id: id++,
            label: fdValue(`${adjectives[
                rand() * 1000 % adjectives.length >> 0]} ${colours[
                rand() * 1000 % colours.length >> 0]} ${nouns[
                rand() * 1000 % nouns.length >> 0]}`)
        })
    }
    return arr;
}

export class Store {
    constructor() {
        this.data = fdValue([]);
        this.selectedItem = fdValue(null)
        this.select = (item) => {
            this.selectedItem.value = item;
        }
        this.remove = (item) => {
            const removeIndex = this.data.value.indexOf(item)
            this.data.value.splice(removeIndex, 1)
            this.data.value = [...this.data.value]
        }
    }

    setData(count = 1000) {
        this.data.value = buildData(count);
    }

    append(count = 1000) {
        this.data.value = this.data.value.concat(buildData(count))
    }

    clear() {
        this.data.value = [];
    }

    update() {
        const length = this.data.value.length
        for (let i = 0; i < length; i += 10) {
            const item = this.data.value[i]
            item.label.value = `${item.label.value} !!!`
        }
    }

    swapData() {
        const arr = this.data.value
        if (arr.length <= 998) {
            return
        }

        const temp = arr[1]
        arr[1] = arr[998]
        arr[998] = temp
        this.data.value = [...arr]
    }
}