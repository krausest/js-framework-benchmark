import * as Surplus from 'surplus';
import S from 's-js';
import { mapSample } from 's-array';
import { App } from './controller';

Surplus; // have to reference it, or ts removes it from package :(

export let AppView = (app : App) => 
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Surplus v0.4.0</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={e => app.run()}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={e => app.runLots()}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={e => app.add()}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={e => app.update()}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={e => app.clear()}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={e => app.swapRows()}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data"  
                onClick = {(e : any) => e.target.matches('.delete') ? app.delete(rowId(e)) : app.select(rowId(e))}>
                { TBody(app) }
            </table>
            <span className="preloadicon glyphicon glyphicon-remove"></span>
        </div>,
    rowId = ({target: el} : {target : HTMLElement}) => { 
        while (el.tagName !== 'TR') el = el.parentElement!; 
        return +el.childNodes[0].textContent!; 
    },
    TBody = (app : App) => {
        const index = {} as { [id : number] : HTMLTableRowElement | undefined},
            trs = mapSample(app.store.data, row =>
                <tr ref={index[row.id]!}>
                    <td className="col-md-1" innerText={row.id}></td>
                    <td className="col-md-4">
                        <a innerText={row.label()}></a>
                    </td>
                    <td className="col-md-1"><a><span className="glyphicon glyphicon-remove delete"></span></a></td>
                    <td className="col-md-6"></td>
                </tr>,
                row => index[row.id] = undefined);

        S.on(app.store.selected, (tr? : HTMLTableRowElement) => {
            if (tr) tr.className = '';
            tr = index[app.store.selected()!];
            if (tr) tr.className = 'danger';
            return tr;
        }, undefined);
        
        return <tbody>{trs}</tbody>;
    };