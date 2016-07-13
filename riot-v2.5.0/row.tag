/*global riot */
<row class="{opts.data.id == parent.opts.selected ? class='danger' : ''}">
					<td class="col-md-1">{ opts.data.id }</td>
					<td class="col-md-4">
						<a onclick={select}>{ opts.data.label }</a>
					</td>
					<td class="col-md-1">
						<a onclick={remove}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
					</td>
		 			<td class="col-md-6"></td>
	<script>
	'use strict';
	select(evt) {
		this.parent.opts.select(this.opts.data.id);
	};
	remove(evt) {
		this.parent.opts.delete(this.opts.data.id);
	};
	</script>
</row>
