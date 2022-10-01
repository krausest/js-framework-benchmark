import {UI} from "UIBase";

class Row extends UI.Primitive("tr") {

	getRowObject() {
		return this.options.rowObject;
	}

	isSelected() {
		const rowObject = this.getRowObject();
		return rowObject.getStore().selected === rowObject.id;
	}

	extraNodeAttributes(attr) {
		if (this.isSelected()) {
			attr.addClass("danger");
		}
	}

	render() {
		const state = this.getRowObject();
		return [
			<td className="col-md-1">{state.id}</td>,
			<td className="col-md-4">
				<a onClick={() => this.getRowObject().setSelected()}>{state.label}</a>
			</td>,
			<td className="col-md-1"><a onClick={() => this.getRowObject().delete()}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>,
			<td className="col-md-6"></td>];
	}

	setOnUpdate() {
		this.attachUpdateListener(this.getRowObject(), () => this.redraw());
	}

	refresh() {
		this.setOnUpdate();

		this.removeRef();
		this.options.ref.name = "row" + this.getRowObject().id;
		this.applyRef();

		this.redraw();
	}

	onMount() {
		this.setOnUpdate();
	}
}

export {Row};
