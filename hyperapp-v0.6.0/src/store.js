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

const model = {
    data: [],
    selected: false
}

const reducers = {
    run: model => ({
        data: buildData(1000),
        selected: undefined
    }),

    add: model => ({
        data: model.data.concat(buildData(1000)),
        selected: undefined
    }),

    runLots: model => ({
        data: buildData(10000),
        selected: undefined
    }),

    clear: model => ({
        data: [],
        selected: undefined
    }),

    update: model => {
        return {
            data: model.data.map((d, i) => {
                if (i % 10 === 0) {
                    d.label = `${d.label} !!!`
                }
                return d
            }),
            selected: undefined
        }
    },

    swapRows: model => {
        if (model.data.length <= 10) {
            return model
        }

        const temp = model.data[4]
        model.data[4] = model.data[9]
        model.data[9] = temp

        return {
            data: model.data,
            selected: model.selected
        }
    },

    select: (model, data) => ({
        data: model.data,
        selected: data.id
    }),

    delete: (model, data) => ({
        data: model.data.filter(d => d.id !== data.id)
    })
}

export {
    model, reducers
}

