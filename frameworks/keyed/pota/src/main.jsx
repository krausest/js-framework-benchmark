import { render, signal } from 'pota'
import { For } from 'pota/components'

import { usePrevious } from 'pota/use/selector'

let idCounter = 1
const adjectives = [
		'pretty',
		'large',
		'big',
		'small',
		'tall',
		'short',
		'long',
		'handsome',
		'plain',
		'quaint',
		'clean',
		'elegant',
		'easy',
		'angry',
		'crazy',
		'helpful',
		'mushy',
		'odd',
		'unsightly',
		'adorable',
		'important',
		'inexpensive',
		'cheap',
		'expensive',
		'fancy',
	],
	colours = [
		'red',
		'yellow',
		'blue',
		'green',
		'pink',
		'brown',
		'purple',
		'brown',
		'white',
		'black',
		'orange',
	],
	nouns = [
		'table',
		'chair',
		'house',
		'bbq',
		'desk',
		'car',
		'pony',
		'cookie',
		'sandwich',
		'burger',
		'pizza',
		'mouse',
		'keyboard',
	]

function _random(max) {
	return Math.round(Math.random() * 1000) % max
}

function buildData(count) {
	const data = new Array(count)
	for (let i = 0; i < count; i++) {
		const [label, , update] = signal(
			`${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`,
		)
		data[i] = {
			id: idCounter++,
			label,
			update,
		}
	}
	return data
}

const Button = ({ id, text, fn }) => (
	<div class="col-sm-6 smallpad">
		<button
			prop:textContent={text}
			id={id}
			class="btn btn-primary btn-block"
			type="button"
			on:click={fn}
		/>
	</div>
)

const App = () => {
	const [data, setData, updateData] = signal([]),
		run = () => {
			setData(buildData(1000))
		},
		runLots = () => {
			setData(buildData(10000))
		},
		add = () => {
			updateData(d => [...d, ...buildData(1000)])
		},
		update = () => {
			const d = data()
			const len = d.length
			for (let i = 0; i < len; i += 10) d[i].update(l => l + ' !!!')
		},
		swapRows = () => {
			const d = [...data()]
			if (d.length > 998) {
				const tmp = d[1]
				d[1] = d[998]
				d[998] = tmp
				setData(d)
			}
		},
		clear = () => {
			setData([])
		},
		remove = id => {
			updateData(d => {
				const idx = d.findIndex(datum => datum.id === id)
				d.splice(idx, 1)
				return [...d]
			})
		},
		danger = usePrevious((next, previous) => {
			next.setAttribute('class', 'danger')

			if (previous) {
				previous.removeAttribute('class')
			}
			return next
		})

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>pota Keyed</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<Button
								id="run"
								text="Create 1,000 rows"
								fn={run}
							/>
							<Button
								id="runlots"
								text="Create 10,000 rows"
								fn={runLots}
							/>
							<Button
								id="add"
								text="Append 1,000 rows"
								fn={add}
							/>
							<Button
								id="update"
								text="Update every 10th row"
								fn={update}
							/>
							<Button
								id="clear"
								text="Clear"
								fn={clear}
							/>
							<Button
								id="swaprows"
								text="Swap Rows"
								fn={swapRows}
							/>
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody
					on:click={e => {
						if ('remove' in e.target.dataset) {
							remove(
								+e.target.parentNode.parentNode.parentNode.firstChild
									.textContent,
							)
						} else if ('select' in e.target.dataset) {
							danger(e.target.parentNode.parentNode)
						}
					}}
				>
					<For each={data}>
						{row => {
							return (
								<tr>
									<td
										prop:textContent={row.id}
										class="col-md-1"
									/>
									<td class="col-md-4">
										<a
											data-select
											prop:textContent={row.label}
										/>
									</td>
									<td class="col-md-1">
										<a>
											<span
												data-remove
												aria-hidden="true"
												class="glyphicon glyphicon-remove"
											/>
										</a>
									</td>
									<td class="col-md-6" />
								</tr>
							)
						}}
					</For>
				</tbody>
			</table>
			<span
				aria-hidden="true"
				class="preloadicon glyphicon glyphicon-remove"
			/>
		</div>
	)
}

render(App, document.getElementById('main'))
