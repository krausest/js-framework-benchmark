/*global riot */
<app>
	<div class="container">
		<div class="jumbotron">
			<div class="row">
				<div class="col-md-6">
					<h1>riot v2.5.0</h1>
				</div>
				<div class="col-md-6">
					<div class="row">
						<div class="col-sm-6 smallpad">
							<button type="button" class="btn btn-primary btn-block" id="run" onclick={run} >Create 1,000 rows</button>
						</div>
						<div class="col-sm-6 smallpad">
							<button type="button" class="btn btn-primary btn-block" id="runlots" onclick={runLots} >Create 10,000 rows</button>
						</div>
						<div class="col-sm-6 smallpad">
							<button type="button" class="btn btn-primary btn-block" id="add" onclick={add} >Append 1,000 rows</button>
						</div>
						<div class="col-sm-6 smallpad" id="addUpdateHere">
<!--							<button type="button" class="btn btn-primary btn-block" id="_update" onclick={change} >Update every 10th row</button> -->
						</div>
						<div class="col-sm-6 smallpad">
							<button type="button" class="btn btn-primary btn-block" id="clear" onclick={clear} >Clear</button>
						</div>
						<div class="col-sm-6 smallpad">
							<button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={swapRows} >Swap Rows</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<table class="table table-hover table-striped test-data">
			<tbody>
				<tr each={ item in this.opts.data } class="{item.id == parent.opts.selected ? class='danger' : ''}">
					<td class="col-md-1">{ item.id }</td>
					<td class="col-md-4">
						<a onclick={parent.select}>{ item.label }</a>
					</td>
					<td class="col-md-1">
						<a onclick={parent.remove}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td>
					<td class="col-md-6"></td>
				</tr>
			</tbody>
		</table>
		<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
	</div>
	<script>
	'use strict';
	this.on('mount', function(){
		let elem = document.getElementById("addUpdateHere");
		let button = document.createElement("button");
		button.setAttribute("id","update");
		button.setAttribute("class", "btn btn-primary btn-block");
		button.innerText = "Update every 10th row";
		let that = this;
		button.addEventListener("click", function() {
			that._update();
		});
		elem.appendChild(button);
	})
	this.on('updated', function() {
		this.opts.updated();
	})
	run() {
		this.opts.run();
		this.update();
	};
	runLots() {
		this.opts.runLots();
		this.update();
	};
	add() {
		this.opts.add();
		this.update();
	};
	_update() {
		this.opts.update();
		this.update();
	};
	clear() {
		this.opts.clear();
		this.update();
	};
	swapRows() {
		this.opts.swapRows();
		this.update();
	};
	select(evt) {
		this.opts.select(evt.item.item.id);
		this.update();
	};
	remove(evt) {
		this.opts.delete(evt.item.item.id);
		this.update();
	};
	</script>
</app>