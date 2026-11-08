import { MapItems } from '@ecopages/jsx';
import { computed } from '@ecopages/signals';

const Button = ({ id, 'on:click': onClick, children }) => (
	<div class="col-sm-6 smallpad">
		<button id={id} type="button" class="btn btn-primary btn-block" on:click={onClick}>
			{children}
		</button>
	</div>
);

export function createView(model) {
	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Ecopages JSX</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							<Button id="run" on:click={model.run}>
								Create 1,000 rows
							</Button>
							<Button id="runlots" on:click={model.runLots}>
								Create 10,000 rows
							</Button>
							<Button id="add" on:click={model.add}>
								Append 1,000 rows
							</Button>
							<Button id="update" on:click={model.update}>
								Update every 10th row
							</Button>
							<Button id="clear" on:click={model.clear}>
								Clear
							</Button>
							<Button id="swaprows" on:click={model.swapRows}>
								Swap Rows
							</Button>
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody>
					<MapItems each={model.rows}>
						{(row) => (
							<tr classes={computed(() => (model.selectedId.get() === row.id ? 'danger' : ''))}>
								<td class="col-md-1">{row.id}</td>
								<td class="col-md-4">
									<a on:click={() => model.select(row)}>{row.label}</a>
								</td>
								<td class="col-md-1">
									<a on:click={() => model.remove(row)}>
										<span class="glyphicon glyphicon-remove" aria-hidden="true" />
									</a>
								</td>
								<td class="col-md-6" />
							</tr>
						)}
					</MapItems>
				</tbody>
			</table>
			<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
		</div>
	);
}
