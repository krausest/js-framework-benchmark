/** @jsxImportSource @ecopages/jsx */
import { MapItems } from '@ecopages/jsx';
import { buttons } from './model.js';

/**
 * Renders once. MapItems renders each row once and reuses it while the row stays in the list; each row binds its
 * label text and its class to the row's own signals.
 */
export function createView(model, title) {
	const onRowClick = (event) => {
		const row = event.target.closest('tr');
		if (!row) return;
		if (event.target.closest('.remove')) model.remove(row.rowId);
		else if (event.target.closest('.lbl')) model.select(row.rowId);
	};

	return (
		<div class="container">
			<div class="jumbotron">
				<div class="row">
					<div class="col-md-6">
						<h1>{title}</h1>
					</div>
					<div class="col-md-6">
						<div class="row">
							{buttons.map(([id, label]) => (
								<div class="col-sm-6 smallpad">
									<button id={id} type="button" class="btn btn-primary btn-block" on:click={() => model[id]()}>
										{label}
									</button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<table class="table table-hover table-striped test-data">
				<tbody on:click={onRowClick}>
					<MapItems each={model.rows}>
						{(row) => (
							<tr prop:rowId={row.id} class={row.cls}>
								<td class="col-md-1">{row.id}</td>
								<td class="col-md-4">
									<a class="lbl">{row.label}</a>
								</td>
								<td class="col-md-1">
									<a class="remove">
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
