import * as mim from "mimbl"
import { ITextVN } from "mimbl";



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



function Button( props: mim.IHtmlButtonElementProps, children: any[]): any
{
    return <div class="col-sm-6 smallpad">
        <button type="button" class="btn btn-primary btn-block" {...props}>{children}</button>
    </div>
}



class Main extends mim.Component
{
    private rows: Row[] = null;
    public selectedRow: Row = undefined;
    private vnTBody: mim.IElmVN<HTMLElement>;

    public render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (keyed)</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            <Button id="run" click={this.onCreate1000}>Create 1,000 rows</Button>
                            <Button id="runlots" click={this.onCreate10000}>Create 10,000 rows</Button>
                            <Button id="add" click={this.onAppend1000}>Append 1,000 rows</Button>
                            <Button id="update" click={this.onUpdateEvery10th}>Update every 10th row</Button>
                            <Button id="clear" click={this.onClear}>Clear</Button>
                            <Button id="swaprows" click={this.onSwapRows}>Swap Rows</Button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody vnref={(r) => this.vnTBody = r} updateStrategy={{disableKeyedNodeRecycling: true}}>
                    {this.rows}
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }

    private onCreate1000()
    {
        this.rows = buildRows( this, 1000);
        this.selectedRow = undefined;
        this.vnTBody.setChildren( this.rows);
    }

    private onAppend1000()
    {
    	let newRows = buildRows( this, 1000);
        this.rows = this.rows ? this.rows.concat( newRows) : newRows;
        this.vnTBody.growChildren( undefined, newRows);
    }

    private onUpdateEvery10th()
    {
        if (!this.rows)
            return;

        for (let i = 0; i < this.rows.length; i += 10)
            this.rows[i].updateLabel()
    }

    private onCreate10000()
    {
        this.rows = buildRows( this, 10000);
        this.selectedRow = undefined;
        this.vnTBody.setChildren( this.rows);
    }

    private onClear()
    {
        this.rows = null;
        this.selectedRow = undefined;
        this.vnTBody.setChildren( null);
    }

    private onSwapRows()
    {
		if (this.rows && this.rows.length > 998)
		{
            let t = this.rows[1];
            this.rows[1] = this.rows[998];
            this.rows[998] = t;
            this.vnTBody.swapChildren( 1, 1, 998, 1);
		}
    }

    public onSelectRowClicked( rowToSelect: Row)
    {
        if (rowToSelect === this.selectedRow)
            return;

        if (this.selectedRow)
            this.selectedRow.trVN.setProps( {class: undefined});

        this.selectedRow = rowToSelect;
        this.selectedRow.trVN.setProps( {class: "danger"});
    }

    public onDeleteRowClicked( rowToDelete: Row)
    {
        if (rowToDelete === this.selectedRow)
            this.selectedRow = undefined;

        let id = rowToDelete.id;
        let i = this.rows.findIndex( row => row.id == id);
        this.rows.splice( i, 1);
        this.vnTBody.spliceChildren( i, 1);
    }
}

let glyphVN = <span class="glyphicon glyphicon-remove" aria-hidden="true"/>;
let lastCellVN = <td class="col-md-6"/>;

class Row extends mim.Component
{
	main: Main;
	id: number;
    label: string;
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

    public willMount()
    {
        this.trVN = <tr>
            <td class="col-md-1">{this.id}</td>
            <td class="col-md-4"><a click={this.onSelectClicked}>{this.labelVN}</a></td>
            <td class="col-md-1"><a click={this.onDeleteClicked}>{glyphVN}</a></td>
            {/* <td class="col-md-4"><a>{this.labelVN}</a></td>
            <td class="col-md-1"><a>{glyphVN}</a></td> */}
            {lastCellVN}
        </tr> as mim.IElmVN<HTMLTableRowElement>;
    }

    @mim.noWatcher
    public render()
	{
        return this.trVN;
	}

	public updateLabel()
	{
        this.labelVN.setText( this.label += " !!!");
	}

	// public select( selected: boolean)
	// {
    //     this.trVN.setProps( {class: selected ? "danger" : undefined});
	// }

	private onDeleteClicked()
	{
		this.main.onDeleteRowClicked( this);
	}

	private onSelectClicked()
	{
		this.main.onSelectRowClicked( this);
	}
}



mim.mount( <Main/>, document.getElementById('main'));