import { track, defaultTracker, ForEach } from "mutraction-dom";
import { buildData } from "./build-dummy-data.js";
defaultTracker.setOptions({ trackHistory: false, compactOnCommit: false });
const model = track({
    selected: undefined,
});
const items = track([]);
function select(item) {
    model.selected = item;
}
function create(n) {
    items.splice(0, items.length, ...buildData(n));
}
function append(n) {
    items.push(...buildData(n));
}
function update() {
    defaultTracker.startTransaction();
    for (let i = 0, found = 0; i < items.length; i++) {
        if (!(i in items))
            continue;
        if (found++ % 10 === 0)
            items[i].label += " !!!";
    }
    defaultTracker.commit();
}
function clear() {
    items.length = 0;
}
function swapRows() {
    if (items.length > 998) {
        const i1 = 1, i2 = 998;
        [items[i1], items[i2]] = [items[i2], items[i1]];
    }
}
function remove(i) {
    delete items[i];
}
const app = <div className="container">
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-6">
                    <h1>Mutraction-"non-keyed"</h1>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='run' onclick={() => create(1_000)}>Create 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='runlots' onclick={() => create(10_000)}>Create 10,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='add' onclick={() => append(1_000)}>Append 1,000 rows</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='update' onclick={update}>Update every 10th row</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='clear' onclick={clear}>Clear</button>
                        </div>
                        <div className="col-sm-6 smallpad">
                            <button type='button' className='btn btn-primary btn-block' id='swaprows' onclick={swapRows}>Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table className="table table-hover table-striped test-data">
            <tbody id="tbody">
                {ForEach(items, (item, i) => <tr classList={{ danger: item === model.selected }}>
                        <td className="col-md-1">{item.id}</td>
                        <td className="col-md-4">
                            <a className="lbl" onclick={() => select(item)}>{item.label}</a>
                        </td>
                        <td className="col-md-1">
                            <a className="remove" onclick={() => remove(i)}><span className="remove glyphicon glyphicon-remove" ariaHidden="true"></span></a>
                        </td>
                        <td className="col-md-6"></td>
                    </tr>)}
            </tbody>
        </table>
    </div>;
document.querySelector("#main").append(app);
