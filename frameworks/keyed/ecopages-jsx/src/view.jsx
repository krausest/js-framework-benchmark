import { MapItems } from '@ecopages/jsx';
import { computed } from '@ecopages/signals';

export function createView(model) {
	const buttons = [
		{ id: 'run', label: 'Create 1,000 rows', action: model.run },
		{ id: 'runlots', label: 'Create 10,000 rows', action: model.runLots },
		{ id: 'add', label: 'Append 1,000 rows', action: model.add },
		{ id: 'update', label: 'Update every 10th row', action: model.update },
		{ id: 'clear', label: 'Clear', action: model.clear },
		{ id: 'swaprows', label: 'Swap Rows', action: model.swapRows },
	];

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>Ecopages JSX</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							{buttons.map(({ id, label, action }) => (
								<div class="col-sm-6 smallpad">
									<button id={id} type="button" class="btn btn-primary btn-block" on:click={action}>
										{label}
									</button>
								</div>
							))}
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
