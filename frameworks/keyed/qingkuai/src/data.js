let id = 1

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
    "fancy"
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
    "orange"
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
    "keyboard"
]

function random(max) {
    return (Math.random() * max) | 0
}

export function buildData(count) {
    const data = new Array(count)
    const adjectiveCount = adjectives.length
    const colourCount = colours.length
    const nounCount = nouns.length
    let nextId = id

    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label:
                adjectives[random(adjectiveCount)] +
                " " +
                colours[random(colourCount)] +
                " " +
                nouns[random(nounCount)]
        }
    }

    id = nextId
    return data
}
