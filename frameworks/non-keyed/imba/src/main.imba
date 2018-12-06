var A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]
var C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]
var N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",  "keyboard"]

tag RemoveIcon < span
	def build
		set('aria-hidden', true)

	def render
		<self.glyphicon.glyphicon-remove>

tag Row < tr
	prop select
	prop remove
	prop item
	prop selected

	def onSelect
		@select(@item)

	def onRemove
		@remove(@item)

	def render
		<self .danger=@selected>
			<td.col-md-1> @item:id
			<td.col-md-4><a :tap.onSelect> @item:label
			<td.col-md-1><a :tap.onRemove><RemoveIcon>
			<td.col-md-6>

tag Button
	prop id
	prop cb
	prop title

	def render
		<self>
			<div.col-sm-6.smallpad>
				<button.btn.btn-primary.btn-block type='button' id=@id :tap=@cb> @title

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
		Imba.commit()

	def select item
		selected = item:id

	def remove item
		items.splice(items.indexOf(item), 1)
		Imba.commit()

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
		Math.round(Math.random() * 1000) % max

	def render
		<self>
			<div.container>
				<div.jumbotron>
					<div.row>
						<div.col-md-6>
							<h1> 'Imba non-keyed'
						<div.col-md-6>
							<div.row>
								<Button id='run' title='Create 1,000 rows' cb=(do run)>
								<Button id="runlots" title="Create 10,000 rows" cb=(do runLots)>
								<Button id="add" title="Append 1,000 rows" cb=(do add)>
								<Button id="update" title="Update every 10th row" cb=(do update)>
								<Button id="clear" title="Clear" cb=(do clear)>
								<Button id="swaprows" title="Swap Rows" cb=(do swapRows)>

				<table.table.table-hover.table-striped.test-data>
					<tbody> for item in items
						<Row item=item selected=(selected === item:id) select=(do select(item)) remove=(do remove(item))>
				<RemoveIcon.preloadicon>

Imba.mount <Main[{selected: 0, nextId: 0}]>
