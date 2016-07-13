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
					<tr riot-tag="row" each={this.opts.data} data={this} no-reorder/>
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
	run() {
		this.opts.run();
	};
	runLots() {
		this.opts.runLots();
	};
	add() {
		this.opts.add();
	};
	_update() {
		this.opts.update();
		this.update(); // Why is that neccessary?
	};
	clear() {
		this.opts.clear();
	};
	swapRows() {
		this.opts.swapRows();
	};
	select(evt) {
		this.opts.select(evt.item.item.id);
	};
	remove(evt) {
		this.opts.delete(evt.item.item.id);
	};
	</script>
</app>