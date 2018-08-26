import * as Surplus from 'surplus'; Surplus;
import S from 's-js';
import { mapSample } from 's-array';
import { Store, Row } from './store';

type Tr = HTMLTableRowElement & { model : Row };

export const 
    AppView = (store : Store) => 
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Surplus Keyed</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={store.run}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={store.runLots}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={store.add}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={store.update}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={store.clear}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={store.swapRows}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody onClick={({ target } : any, m = model(target)) => target.matches('.delete') ? store.delete(m.id) : store.select(m.id)}>
                    {// to avoid creating N computations watching one piece of state (selected()), lift className computation out of loop
                     (trs => (S((tr? : Tr) => {
                         const s = store.selected() as any; 
                         if (tr) tr.className = '';
                         if (tr = s && trs().find(tr => tr.model.id === s)) tr.className = 'danger';
                         return tr; 
                     }), trs))
                     (mapSample<Row, Tr>(store.data, row => 
                        <tr model={row}>
                            <td className="col-md-1">{row.id}</td>
                            <td className="col-md-4">
                                <a>{row.label()}</a>
                            </td>
                            <td className="col-md-1"><a><span className="glyphicon glyphicon-remove delete" aria-hidden="true"></span></a></td>
                            <td className="col-md-6"></td>
                        </tr> as Tr
                    ))}
                </tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>,
    model = (el : any) : Row => el && (el.model || model(el.parentNode))