import * as mim from "mimbl"
import {Row, IMainContainer} from "./Row"
import {Store} from "./Store"

export class TBody extends mim.Component
{
    main: IMainContainer;
    store: Store;
	rows: Row[];
    selectedRow: Row;

    constructor( main)
    {
        super();

        this.main = main;
        this.store = main.store;
        this.rows = [];
    }

    run() {
        this.store.run();
        this.selectedRow = undefined;
		this.rows = this.store.data.map( item => new Row( this.main, item.id, item.label));
        this.updateMe();
    }
    
    add() {
        this.store.add().forEach( item => this.rows.push( new Row( this.main, item.id, item.label)));
        this.updateMe();
    }
    
    update() {
        this.store.update();
        this.store.data.forEach( (item, i) => this.rows[i].setItem( item.label, this.store.selected));
    }
    
    runLots() {
        this.store.runLots();
        this.selectedRow = undefined;
		this.rows = this.store.data.map( item => new Row( this.main, item.id, item.label));
        this.updateMe();
    }
    
    clear() {
        this.store.clear();
        this.selectedRow = undefined;
        this.rows = [];
    }
    
    swapRows() {
		if (this.rows.length > 998)
		{
            this.store.swapRows( 1, 998);
			let tempRow = this.rows[1];
			this.rows[1] = this.rows[998];
			this.rows[998] = tempRow;
            this.updateMe();
		}
    }
    
    onSelectRowClicked( row: Row): void
    {
        this.store.select( row.id);
        if (this.selectedRow && this.selectedRow !== row)
            this.selectedRow.select( false);

        this.selectedRow = row;
    }
    
    onDeleteRowClicked(row: Row): void
    {
        this.store.delete( row.id);
        let index = this.rows.indexOf( row);
        this.rows.splice( index, 1);

        if (this.selectedRow === row)
            this.selectedRow = undefined;

        this.updateMe();
    }
    
    render()
    {
        return <tbody updateStrategy={{allowKeyedNodeRecycling:false}}>
            {this.rows}
        </tbody>;
    }
}

