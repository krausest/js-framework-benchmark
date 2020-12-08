import * as mim from "mimbl"



export interface IMainContainer
{
    onSelectRowClicked( row: Row): void;
    onDeleteRowClicked( row: Row): void;
}



export class Row extends mim.Component
{
	main: IMainContainer;

	id: number;
	@mim.updatable label: string;
	@mim.updatable selected: boolean;

	constructor( main: IMainContainer, id: number, label: string)
	{
		super();

		this.main = main;
		this.id = id;
		this.label = label;
		this.selected = false;
	}

	setItem( newLabel: string, newSelectedID: number)
	{
		// let newSelected = this.id === newSelectedID;

		// if (newLabel !== this.label || this.selected !== newSelected)
		// 	this.updateMe();

		this.label = newLabel;
		this.selected = this.id === newSelectedID;
	}

	select( selected: boolean)
	{
		// if (this.selected !== selected)
		// 	this.updateMe();

		this.selected = selected;
	}

	onDeleteClicked()
	{
		this.main.onDeleteRowClicked( this);
	}

	onSelectClicked()
	{
		if (this.selected)
			return;

		this.selected = true;
		this.main.onSelectRowClicked( this);
		// this.updateMe();
	}

	render()
	{
		return <tr class={this.selected ? "danger" : undefined}>
			<td class="col-md-1">{this.id}</td>
			<td class="col-md-4"><a click={this.onSelectClicked}>{this.label}</a></td>
			<td class="col-md-1"><a click={this.onDeleteClicked}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
			<td class="col-md-6"></td>
		</tr>;
	}
}

