import * as mim from "mimbl"



let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

type Row = {
    id: number,
	idTrigger: mim.ITrigger<number>;
    label: string;
    labelTrigger: mim.ITrigger<string>;
    selectedTrigger: mim.ITrigger<string>;
}



let nextID = 1;

function buildRows( /*main: Main,*/ count: number): Row[]
{
    let rows = new Array<Row>( count);
    let label: string, id: number;
    for( let i = 0; i < count; i++)
    {
        id = nextID++;
        label = `${adjectives[rand(adjectives.length)]} ${colours[rand(colours.length)]} ${nouns[rand(nouns.length)]}`;
        rows[i] = {
            id,
            idTrigger: mim.createTrigger( id),
            label,
            labelTrigger: mim.createTrigger( label),
            selectedTrigger: mim.createTrigger()
        };
    }

    return rows;
}

function rand( max: number)
{
    return Math.round(Math.random() * 1000) % max;
}



function Button( props: mim.IHtmlButtonElementProps, children: any[]): any
{
    return <div class="col-sm-6 smallpad">
        <button type="button" class="btn btn-primary btn-block" {...props}>{children}</button>
    </div>
}



class Main extends mim.Component
{
    @mim.trigger(0) private rows: Row[] = null;
    // private rows: Row[] = null;
    public selectedRow: Row = undefined;
    @mim.ref private vnTBody: mim.IElmVN<HTMLElement>;

    public render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (non-keyed)</h1>
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
                {this.renderRows}
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }

    private renderRows(): any
    {
        return <tbody vnref={this.vnTBody}>
            {this.rows?.map( row =>
                <tr class={row.selectedTrigger}>
                    <td class="col-md-1">{row.idTrigger}</td>
                    <td class="col-md-4"><a click={[this.onSelectRowClicked, row]}>{row.labelTrigger}</a></td>
                    <td class="col-md-1">
                        <a click={[this.onDeleteRowClicked, row]}>
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"/>
                        </a>
                    </td>
                    <td class="col-md-6"/>
                </tr>
            )}
        </tbody>
    }

    private onCreate1000()
    {
        this.rows = buildRows( 1000);
        this.selectedRow = undefined;
    }

    private onAppend1000()
    {
    	let newRows = buildRows( 1000);
        this.rows = this.rows ? this.rows.concat( newRows) : newRows;
    }

    private onUpdateEvery10th()
    {
        if (!this.rows)
            return;

        let row: Row;
        for (let i = 0; i < this.rows.length; i += 10)
        {
            row = this.rows[i];
            row.labelTrigger.set( row.label += " !!!")
        }
    }


    private onCreate10000()
    {
        this.rows = buildRows( 10000);
        this.selectedRow = undefined;
    }

    private onClear()
    {
        this.rows = null;
        this.selectedRow = undefined;
    }

    private onSwapRows()
    {
		if (this.rows && this.rows.length > 998)
		{
            let row1 = this.rows[1];
            let row998 = this.rows[998];

            let id1 = row1.id;
            let label1 = row1.label;
            row1.idTrigger.set( row1.id = row998.id);
            row1.labelTrigger.set( row1.label = row998.label);
            row998.idTrigger.set( row998.id = id1);
            row998.labelTrigger.set( row998.label = label1);
		}
    }

    public onSelectRowClicked = (e: MouseEvent, rowToSelect: Row): void =>
    {
        if (rowToSelect === this.selectedRow)
            return;

        if (this.selectedRow)
            this.selectedRow.selectedTrigger.set( null);

        this.selectedRow = rowToSelect;
        rowToSelect.selectedTrigger.set( "danger");
    }

    public onDeleteRowClicked = (e: MouseEvent, rowToDelete: Row): void =>
    {
        if (rowToDelete === this.selectedRow)
            this.selectedRow = undefined;

        let i = this.rows.indexOf( rowToDelete);
        this.rows.splice( i, 1);
        this.vnTBody.spliceChildren( i, 1, undefined, mim.TickSchedulingType.Sync);
    }
}



mim.mount( <Main/>, document.getElementById('main'));