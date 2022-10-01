import { StreamBox } from '@crui/reactive/rx/box/stream';
import { DRW$B } from '@crui/reactive/rx/box/types';
import { StreamList } from '@crui/reactive/rx/list/stream';
import { DRW$L, R$L } from '@crui/reactive/rx/list/types';

export type Item = {
    id: number,
    label: DRW$B<string>,
    selected: DRW$B<boolean>
}

export class Store {
    private data: DRW$L<Item>
    private selected: Item|null

    constructor() {
        this.data = new StreamList([])
        this.selected = null
    }

    getData(): R$L<Item> {
        return this.data
    }

    select = (item: Item) => {
        if (this.selected === item)
            return

        if (this.selected !== null)
            this.selected.selected.set(false)

        this.selected = item
        item.selected.set(true)
    }

    set1k = () => {
        this.data.set(buildData(1_000))
    }
    
    set10k = () => {
        this.data.set(buildData(10_000))
    }

    add1k = () => {
        this.data.concat(buildData(1_000))
    }

    remove = (item: Item) => {
        this.data.remove(item)
    }

    updateEvery10th = () => {
        const items = this.data.get()
        for (let i = 0; i < items.length; i += 10) {
            const label = items[i].label
            label.set(label.get() + ' !!!')
        }
    }

    swapRows = () => {
        if (this.data.get().length <= 998)
            return
        
        const tmp = this.data.item(1)!
        this.data.update(1, this.data.item(998)!)
        this.data.update(998, tmp)
    }

    clear = () => {
        this.data.set([])
    }
}

let idCounter = 1
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count: number) {
    let data = new Array<Item>(count);

    for (let i = 0; i < count; i++) {
        const adjective = pickRandom(adjectives)
        const color = pickRandom(colours)
        const noun = pickRandom(nouns)

        data[i] = {
            id: idCounter++,
            label: new StreamBox(`${adjective} ${color} ${noun}`),
            selected: new StreamBox(false)
        }
    }

    return data;
}

function pickRandom<T>(xs: T[]): T {
    return xs[random(xs.length)]
}

function random (max: number) { 
    return Math.round(Math.random() * 1000) % max
}