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

const colors = [
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

let id = 1

const random = (max) => Math.round(Math.random() * 1000) % max

export const buildData = (count) => {
  let data = []
  for (let i = 0; i < count; i++)
    data.push({
      id: id++,
      label:
        adjectives[random(adjectives.length)] +
        " " +
        colors[random(colors.length)] +
        " " +
        nouns[random(nouns.length)],
    })
  return data
}
