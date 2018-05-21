import * as Surplus from 'surplus'; Surplus;
import S from 's-js';
import { mapSample } from 's-array';
import { Store } from './store';

export const 
    AppView = (store : Store) => 
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Surplus v0.5.0</h1>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="run" onClick={e => store.run()}>Create 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="runlots" onClick={e => store.runLots()}>Create 10,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="add" onClick={e => store.add()}>Append 1,000 rows</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="update" onClick={e => store.update()}>Update every 10th row</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="clear" onClick={e => store.clear()}>Clear</button>
                            </div>
                            <div className="col-sm-6 smallpad">
                                <button type="button" className="btn btn-primary btn-block" id="swaprows" onClick={e => store.swapRows()}>Swap Rows</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody onClick={(e : any) => e.target.matches('.delete') ? store.delete(rowId(e)) : store.select(rowId(e))}>
                    {clearAfterAnimationRequest(mapSample(store.data, row => 
                        <tr className={row.id === store.selected() ? 'danger' : ''}>
                            <td className="col-md-1">{row.id}</td>
                            <td className="col-md-4">
                                <a>{row.label()}</a>
                            </td>
                            <td className="col-md-1"><a><span className="glyphicon glyphicon-remove delete" aria-hidden="true"></span></a></td>
                            <td className="col-md-6"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>,
    rowId = (e : any) => +e.target.closest('tr').firstChild.textContent,
    // For not well understood reasons, Chrome runs DOM clear operations a good bit faster when they're
    // deferred until after an animation frame.  So we buffer the row signal in a data signal and delay
    // its update when the signal would clear the contents.
    clearAfterAnimationRequest = function deferAF<T>(s : () => T[]) {
        var data = S.data(S.sample(s)),
            updater = () => data(s());
        S(() => s().length === 0 ? requestAnimationFrame(updater) : updater());
        return () => data();
    };