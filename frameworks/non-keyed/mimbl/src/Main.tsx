import * as mim from "mimbl"



let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random( max: number)
{
    return Math.round(Math.random() * 1000) % max;
}

let nextID = 1;

function buildRows( main: Main, count: number): Row[]
{
    let rows = new Array<Row>( count);
    for( let i = 0; i < count; i++)
        rows[i] = new Row( main, nextID++,
            `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`);

    return rows;
}



class Main extends mim.Component
{
    nextID = 1;

    // Flat array of Row components
    private rows: Row[] = null;

    // Currently selected Row component
    public selectedRow: Row = undefined;



    onCreate1000()
    {
        this.rows = buildRows( this, 1000);
        this.selectedRow = undefined;
        this.updateMe( this.renderRows);
    }

    onAppend1000()
    {
    	let newRows = buildRows( this, 1000);
        this.rows = this.rows ? this.rows.concat( newRows) : newRows;
        this.updateMe( this.renderRows);
    }

    onUpdateEvery10th()
    {
        if (!this.rows)
            return;

        for (let i = 0; i < this.rows.length; i += 10)
            this.rows[i].updateLabel()
    }

    onCreate10000()
    {
        this.rows = buildRows( this, 10000);
        this.selectedRow = undefined;
        this.updateMe( this.renderRows);
    }

    onClear()
    {
        this.rows = null;
        this.selectedRow = undefined;
        this.updateMe( this.renderRows);
    }

    onSwapRows()
    {
		if (this.rows && this.rows.length > 998)
		{
            let t = this.rows[1];
            this.rows[1] = this.rows[998];
            this.rows[998] = t;
            this.updateMe( this.renderRows);
		}
    }

    onSelectRowClicked( rowToSelect: Row)
    {
        if (rowToSelect === this.selectedRow)
            return;

        if (this.selectedRow)
            this.selectedRow.select( false);

        this.selectedRow = rowToSelect;
        rowToSelect.select( true);
    }

    onDeleteRowClicked( rowToDelete: Row)
    {
        if (rowToDelete === this.selectedRow)
            this.selectedRow = undefined;

        let id = rowToDelete.id;
        let i = 0;
        for( let row of this.rows)
        {
            if (row.id == id)
            {
                this.rows.splice( i, 1);
                break;
            }
            else
                i++;
        }

        this.updateMe( this.renderRows);
    }

    @mim.noWatcher render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (non-keyed)</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="run" click={this.onCreate1000}>Create 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="runlots" click={this.onCreate10000}>Create 10,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="add" click={this.onAppend1000}>Append 1,000 rows</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="update" click={this.onUpdateEvery10th}>Update every 10th row</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="clear" click={this.onClear}>Clear</button>
                            </div>
                            <div class="col-sm-6 smallpad">
                                <button type="button" class="btn btn-primary btn-block" id="swaprows" click={this.onSwapRows}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                {this.renderRows}
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }

    @mim.noWatcher renderRows()
    {
        if (!this.rows)
            return null;

        return <tbody>{this.rows}</tbody>
    }
}

let glyphVN = <span class="glyphicon glyphicon-remove" aria-hidden="true"/>;
let lastCellVN = <td class="col-md-6"/>;

class Row extends mim.Component
{
	main: Main;
	id: number;
    label: string;
    // trVNRef = new mim.ElmRef<HTMLTableRowElement>();
    labelVN: mim.ITextVN;
    trVN: mim.IElmVN<HTMLTableRowElement>;

	constructor( main: Main, id: number, label: string)
	{
		super();

		this.main = main;
		this.id = id;
        this.label = label;
        this.labelVN = mim.createTextVN( label);
	}

    willMount()
    {
        this.trVN = <tr class={this.main.selectedRow === this ? "danger" : undefined}>
            <td class="col-md-1">{this.id}</td>
            <td class="col-md-4"><a click={this.onSelectClicked}>{this.labelVN}</a></td>
            <td class="col-md-1"><a click={this.onDeleteClicked}>{glyphVN}</a></td>
            {lastCellVN}
            {/* <td class="col-md-1"><a click={this.onDeleteClicked}><span class="glyphicon glyphicon-remove" aria-hidden="true"/></a></td>
            <td class="col-md-6"/> */}
        </tr>;
    }

    didReplace( oldComp: Row): void
    {
        this.labelVN = oldComp.labelVN;
        this.trVN = oldComp.trVN;
    }

	updateLabel()
	{
        this.label += " !!!";
        this.labelVN.setText( this.label);
	}

	select( selected: boolean)
	{
        // this.trVNRef.r.setProps( {class: selected ? "danger" : undefined});
        this.trVN.setProps( {class: selected ? "danger" : undefined});
	}

	onDeleteClicked()
	{
		this.main.onDeleteRowClicked( this);
	}

	onSelectClicked()
	{
		this.main.onSelectRowClicked( this);
	}

	@mim.noWatcher render()
	{
        return this.trVN;
		// return <tr vnref={this.trVNRef} class={this.main.selectedRow === this ? "danger" : undefined}>
		// 	<td class="col-md-1">{this.id}</td>
		// 	<td class="col-md-4"><a click={this.onSelectClicked}>{this.labelVN}</a></td>
		// 	<td class="col-md-1"><a click={this.onDeleteClicked}>{glyphVN}</a></td>
		// 	{lastCellVN}
		// </tr>;
	}
}



mim.mount( <Main/>, document.getElementById('main'));