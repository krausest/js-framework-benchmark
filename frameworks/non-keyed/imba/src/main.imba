var A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
var C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
var N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",  "keyboard"]

extend tag element
	attr aria-hidden

tag Row < tr
	def select
		trigger('select',@data)

	def remove
		trigger('remove',@data)

	def render
		return if @data === @prev
		@prev = @data
		<self>
			<td.col-md-1 text=@data:id>
			<td.col-md-4> <a :tap.select text=@data:label>
			<td.col-md-1> <a :tap.remove> <span.glyphicon.glyphicon-remove aria-hidden=true>
			<td.col-md-6>

var items = []
var selected = 0
var nextId = 1

tag Main
	def run
		items = buildData(1000)	
		selected = 0		
		Imba.commit

	def runLots
		items = buildData(10000)
		selected = 0

	def add
		items = items.concat(buildData(1000))

	def update		
		var i = 0
		while i < items:length
			var item = items[i]
			items[i] = { id: item:id, label: item:label + ' !!!' }
			i = i + 10
		Imba.commit

	def select item
		selected = item:id

	def remove item
		items.splice(items.indexOf(item), 1)
		Imba.commit
	
	def onselect e
		select(e.data)
	
	def onremove e
		remove(e.data)

	def clear
		items = []
		selected = 0

	def swapRows		
		if (items:length > 998)
			var temp = items[1]
			items[1] = items[998]
			items[998] = temp
		Imba.commit

	
	def buildData(count)
		var newItems  = Array.new(count)
		var i = 0
		while i < count
			newItems[i] = {
				id: nextId ,
				label: "{A[random(A:length)]} {C[random(C:length)]} {N[random(N:length)]}"
			}
			i = i + 1
			nextId = nextId + 1

		newItems
	
	def random max 
		Math.round(Math.random * 1000) % max

	def render
		<self>
			<div.container>
				<div.jumbotron>
					<div.row>
						<div.col-md-6>
							<h1> 'Imba keyed'
						<div.col-md-6>
							<div.row>
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id='run' :tap.run> 'Create 1,000 rows'
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id="runlots" :tap.runLots> "Create 10,000 rows"
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id="add" :tap.add> "Append 1,000 rows"
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id="update" :tap.update> "Update every 10th row"
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id="clear" :tap.clear> "Clear"
								<div.col-sm-6.smallpad> 
									<button.btn.btn-primary.btn-block type='button' id="swaprows" :tap.swapRows> "Swap Rows"
				<table.table.table-hover.table-striped.test-data>
					<tbody> for item in items
						<Row data=item .danger=(selected === item:id)>
				<span.glyphicon.glyphicon-remove.preloadicon aria-hidden=true>

Imba.mount <Main>
