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
const adjectivesLength = adjectives.length
const colorsLength = colors.length
const nounsLength = nouns.length

const random = (max) => Math.round(Math.random() * 1000) % max

export const buildData = (count = 1000) => {
  let data = new Array(count)
  for (let i = 0; i < count; i++)
    data[i] = {
      id: id++,
      label: `${adjectives[random(adjectivesLength)]} ${colors[random(colorsLength)]} ${nouns[random(nounsLength)]}`
    }
  return data
}
