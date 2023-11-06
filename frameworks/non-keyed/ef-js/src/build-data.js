let _id = 1

const _random = max => Math.round(Math.random() * 1000) % max

const buildData = (app, count = 1000) => {
	const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
	const colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
	const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]

	const data = new Array(count)

	for (let i = 0; i < count; i++) {
		data[i] = {
			app,
			$data: {
				id: _id,
				// eslint-disable-next-line prefer-template
				label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
			}
		}
		_id += 1
	}

	return data
}

export default buildData
