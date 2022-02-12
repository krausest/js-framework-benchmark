import {memo} from "react";
import {render} from "react-dom";
import {batch, mutated, useTagged} from "react-tagged-state";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (res, count) => {
    for (let index = 0; index < count; index++) {
        res.push({
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
        })
    }
}

const data = [];

let selected = 0;

const Row = memo(({item}) => {
    useTagged(item);

    return (
        <tr className={selected === item.id ? "danger" : ""}>
            <td className="col-md-1">{item.id}</td>
            <td className="col-md-4">
                <a onClick={() => batch(() => {
                    if (selected) {
                        mutated(data.find(({id}) => id === selected));
                    }

                    selected = item.id;
                    mutated(item);
                })}>{item.label}</a>
            </td>
            <td className="col-md-1">
                <a onClick={() => {
                    data.splice(data.indexOf(item), 1);
                    mutated(data);
                }}><span className="glyphicon glyphicon-remove" aria-hidden="true"/></a>
            </td>
            <td className="col-md-6"/>
        </tr>
    )
});

const RowList = () => {
    useTagged(data);

    return data.map((item) => <Row key={item.id} item={item}/>)
};

const Button = ({id, title, cb}) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
);

const Main = () => (
    <div className="container">
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-6"><h1>React Tagged State </h1></div>
                <div className="col-md-6">
                    <div className="row">
                        <Button id="run" title="Create 1,000 rows" cb={() => {
                            data.length = 0;
                            selected = 0;
                            buildData(data, 1000);
                            mutated(data);
                        }}/>
                        <Button id="runlots" title="Create 10,000 rows" cb={() => {
                            data.length = 0;
                            selected = 0;
                            buildData(data, 10000);
                            mutated(data);
                        }}/>
                        <Button id="add" title="Append 1,000 rows" cb={() => {
                            buildData(data, 1000);
                            mutated(data);
                        }}/>
                        <Button id="update" title="Update every 10th row" cb={() => batch(() => {
                            for (let index = 0; index < data.length; index += 10) {
                                mutated(data[index]).label += " !!!";
                            }
                        })}/>
                        <Button id="clear" title="Clear" cb={() => {
                            data.length = 0;
                            selected = 0;
                            mutated(data);
                        }}/>
                        <Button id="swaprows" title="Swap Rows" cb={() => {
                            [data[1], data[998]] = [data[998], data[1]];
                            mutated(data);
                        }}/>
                    </div>
                </div>
            </div>
        </div>
        <table className="table table-hover table-striped test-data">
            <tbody>
            <RowList/>
            </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>
);

render(
    <Main/>,
    document.getElementById("main")
);
