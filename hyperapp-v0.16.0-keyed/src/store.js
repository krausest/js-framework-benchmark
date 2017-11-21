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

const state = {
    data: [],
    selected: false
}

const actions = {
    run: state => ({
        data: buildData(1000),
        selected: undefined
    }),

    add: state => ({
        data: state.data.concat(buildData(1000)),
        selected: undefined
    }),

    runLots: state => ({
        data: buildData(10000),
        selected: undefined
    }),

    clear: state => ({
        data: [],
        selected: undefined
    }),

    update: state => {
        return {
            data: state.data.map((d, i) => {
                if (i % 10 === 0) {
                    d.label = `${d.label} !!!`
                }
                return d
            }),
            selected: undefined
        }
    },

    swapRows: state => {
        if (state.data.length <= 10) {
            return state
        }

        const temp = state.data[1]
        state.data[1] = state.data[998]
        state.data[998] = temp

        return {
            data: state.data,
            selected: state.selected
        }
    },

    select: state => id => ({
            data: state.data,
            selected: id
    }),

    delete: state => id => ({
        data: state.data.filter(d => d.id !== id)
    })
}

export {
    state, actions
}

