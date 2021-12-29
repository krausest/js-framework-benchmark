import { memo, useCallback } from "react"
import { render } from "react-dom"
import create from "zustand"
import shallow from "zustand/shallow"

const useStore = create((set) => ({
	data: [],
	selected: null,
	run: () => set({ data: buildData(1000) }),
	runLots: () => set({ data: buildData(10000) }),
	add: () => set((state) => ({ data: [...state.data, ...buildData(1000)] })),
	update: () =>
		set((state) => {
			let newData = state.data.slice(0)
			for (let i = 0, len = newData.length; i < len; i += 10) {
				const r = newData[i]

				newData[i] = { id: r.id, label: r.label + " !!!" }
			}

			return { data: newData }
		}),
	clear: () => set({ data: [] }),
	swapRows: () =>
		set((state) => {
			const d = state.data.slice(0)
			if (d.length > 998) {
				let tmp = d[1]
				d[1] = d[998]
				d[998] = tmp
				return { data: d }
			}
		}),
	remove: (id) =>
		set((state) => {
			const idx = state.data.findIndex((d) => d.id === id)
			return {
				data: [...state.data.slice(0, idx), ...state.data.slice(idx + 1)],
			}
		}),
	select: (id) => set({ selected: id }),
}))

const random = (max) => Math.round(Math.random() * 1000) % max

const A = [
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
const C = [
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
const N = [
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

let nextId = 1

const buildData = (count) => {
	const data = new Array(count)

	for (let i = 0; i < count; i++) {
		data[i] = {
			id: nextId++,
			label: `${A[random(A.length)]} ${C[random(C.length)]} ${
				N[random(N.length)]
			}`,
		}
	}

	return data
}

const getSelect = (state) => state.select
const getRemove = (state) => state.remove

const Row = memo(
	({ item }) => {
		const select = useStore(getSelect)
		const remove = useStore(getRemove)
		const isSelected = useStore(
			useCallback((state) => state.selected === item.id, [item.id])
		)

		return (
			<tr className={isSelected ? "danger" : ""}>
				<td className="col-md-1">{item.id}</td>
				<td className="col-md-4">
					<a onClick={() => select(item.id)}>{item.label}</a>
				</td>
				<td className="col-md-1">
					<a onClick={() => remove(item.id)}>
						<span className="glyphicon glyphicon-remove" aria-hidden="true" />
					</a>
				</td>
				<td className="col-md-6" />
			</tr>
		)
	},
	(prevProps, nextProps) => prevProps.item === nextProps.item
)

const Button = ({ id, cb, title }) => (
	<div className="col-sm-6 smallpad">
		<button
			type="button"
			className="btn btn-primary btn-block"
			id={id}
			onClick={cb}
		>
			{title}
		</button>
	</div>
)

const getRun = (state) => state.run
const getRunLots = (state) => state.runLots
const getAdd = (state) => state.add
const getUpdate = (state) => state.update
const getClear = (state) => state.clear
const getSwapRows = (state) => state.swapRows

const Jumbotron = memo(
	() => {
		const run = useStore(getRun)
		const runLots = useStore(getRunLots)
		const add = useStore(getAdd)
		const update = useStore(getUpdate)
		const clear = useStore(getClear)
		const swapRows = useStore(getSwapRows)

		return (
			<div className="jumbotron">
				<div className="row">
					<div className="col-md-6">
						<h1>React Zustand keyed</h1>
					</div>
					<div className="col-md-6">
						<div className="row">
							<Button id="run" title="Create 1,000 rows" cb={() => run()} />
							<Button
								id="runlots"
								title="Create 10,000 rows"
								cb={() => runLots()}
							/>
							<Button id="add" title="Append 1,000 rows" cb={() => add()} />
							<Button
								id="update"
								title="Update every 10th row"
								cb={() => update()}
							/>
							<Button id="clear" title="Clear" cb={() => clear()} />
							<Button id="swaprows" title="Swap Rows" cb={() => swapRows()} />
						</div>
					</div>
				</div>
			</div>
		)
	},
	() => true
)

const getItems = (state) => state.data

const Main = () => {
	/**
	 * @type {string[]}
	 */
	const items = useStore(getItems, shallow)

	return (
		<div className="container">
			<Jumbotron />
			<table className="table table-hover table-striped test-data">
				<tbody>
					{items.map((item) => (
						<Row key={item.id} item={item} />
					))}
				</tbody>
			</table>
			<span
				className="preloadicon glyphicon glyphicon-remove"
				aria-hidden="true"
			/>
		</div>
	)
}

render(<Main />, document.getElementById("main"))
