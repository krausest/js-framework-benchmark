import * as mim from "mimbl"
import {Store, StoreItem} from "./Store"

export class Main extends mim.Component
{
    private store: Store = new Store();

    // Flat array of Row components
    private rows: Row[] = null;

    // // Map of item IDs to Row components - needed to understand what Row components we can reuse
    // // when data changes
    // private rowMap = new Map<number,Row>();

    // Currently selected Row component
    public selectedRow: Row = undefined;


    public disableRenderWatcher() { return true; }


    private buildRows(): void
    {
        let data = this.store.data;
        let i = 0;
        this.rows = new Array<Row>( data.length);
        for( let item of data)
            this.rows[i++] = new Row( this, item.id, item.label);

        this.updateMe( this.renderRows);
    }


    private addRows(): void
    {
        let data = this.store.data;
        if (data.length === 0)
            return;

        let newRows = new Array<Row>( data.length);
        let i = 0;

        if (this.rows)
        {
            for( ; i < this.rows.length; i++)
                newRows[i] = this.rows[i];
        }

        for( ; i < data.length; i++)
        {
            let item = data[i];
            newRows[i] = new Row( this, item.id, item.label);
        }

        this.rows = newRows;
        this.updateMe( this.renderRows);
    }


    private updateRows( mod: number)
    {
        if (!this.rows)
            return;

        for (let i = 0; i < this.rows.length; i += mod)
            this.rows[i].updateLabel( this.store.data[i].label)
    }

    onCreate1000()
    {
        this.store.run();
        this.buildRows();
        this.selectedRow = undefined;
    }

    onAppend1000()
    {
        this.store.add( 1000);
        this.addRows();
    }

    onUpdateEvery10th()
    {
        if (this.store.data.length === 0)
            return;

        this.store.update(10);
        this.updateRows( 10);
    }

    onCreate10000()
    {
        this.store.runLots();
        this.buildRows();
        this.selectedRow = undefined;
    }

    onClear()
    {
        this.store.clear();
        this.rows = null;
        this.selectedRow = undefined;
        this.updateMe( this.renderRows);
    }

    onSwapRows()
    {
		if (this.store.data.length > 998)
		{
            this.store.swapRows( 1, 998);
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
            this.selectedRow.select();

        this.selectedRow = rowToSelect;
        rowToSelect.select();
    }

    onDeleteRowClicked( rowToDelete: Row)
    {
        if (rowToDelete === this.selectedRow)
            this.selectedRow = undefined;

        let id = rowToDelete.id;
        this.store.delete( id);
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

    render()
    {
        return (<div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>Mimbl (keyed)</h1>
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
            <table class="table table-hover table-striped test-data" updateStrategy={{noRecursiveUnmount: true}}>
                {this.renderRows}
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>);
    }

    renderRows()
    {
        if (!this.rows)
            return null;

        return <tbody updateStrategy={{allowKeyedNodeRecycling: false, noRecursiveUnmount: true}}>
            {this.rows}
        </tbody>
    }
}

export class Row extends mim.Component
{
	main: Main;
	id: number;
	label: string;

    private static glyphVN = <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>;
    private static lastCellVN = <td class="col-md-6"></td>;

	constructor( main: Main, id: number, label: string)
	{
		super();

		this.main = main;
		this.id = id;
		this.label = label;
	}

    public disableRenderWatcher() { return true; }

	updateLabel( newLabel: string)
	{
        this.label = newLabel;
        this.updateMe( this.renderLabel);
	}

	select()
	{
        this.updateMe();
	}

	onDeleteClicked()
	{
		this.main.onDeleteRowClicked( this);
	}

	onSelectClicked()
	{
		this.main.onSelectRowClicked( this);
	}

	render()
	{
		return <tr class={this.main.selectedRow === this ? "danger" : undefined} updateStrategy={{noRecursiveUnmount: true}}>
			{this.renderCells}
		</tr>;
	}

	renderCells()
	{
		return <mim.Fragment>
			<td class="col-md-1">{this.id}</td>
			<td class="col-md-4">{this.renderLabel}</td>
			<td class="col-md-1"><a click={this.onDeleteClicked}>{Row.glyphVN}</a></td>
			{Row.lastCellVN}
		</mim.Fragment>;
	}

	renderLabel()
	{
		return <a click={this.onSelectClicked}>{this.label}</a>;
	}
}



mim.mount( <Main/>, document.getElementById('main'));