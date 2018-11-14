import * as ui from 'hyperoop'

let id = 1

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

    return new Array(count).fill(0).map(_ => ({
        id: id++,
        label: `${adjectives[
        rand() * 1000 % adjectives.length >> 0]} ${colours[
        rand() * 1000 % colours.length >> 0]} ${nouns[
        rand() * 1000 % nouns.length >> 0]}`
    }))
}

type State = {
    data: any[],
    selected: boolean
}

const state: State = {
    data: [],
    selected: false
}

export class Actions extends ui.Actions<State> {
    run(){
        this.set({
            data: buildData(1000),
            selected: undefined
        })
    }

    add(){
        this.set({
            data: this.State.data.concat(buildData(1000)),
            selected: undefined
        })
    }

    runLots(){
        this.set({
            data: buildData(10000),
            selected: undefined
        })
    }

    clear(){
        this.set({
            data: [],
            selected: undefined
        })
    }

    update() {
        this.set({
            data: this.State.data.map((d, i) => {
                if (i % 10 === 0) {
                    d.label = `${d.label} !!!`
                }
                return d
            }),
            selected: undefined
        })
    }

    swapRows() {
        if (this.State.data.length <= 998) {
            return;
        }

        const temp = this.State.data[1]
        this.State.data[1] = state.data[998]
        this.State.data[998] = temp
        this.Renderer.render()
    }

    select(id){
        this.set({
            data: state.data,
            selected: id
        })
    }

    delete(id){
        this.State.data = [...state.data.filter(d => d.id !== id)]
    }
}

export let actions = new Actions(state);


