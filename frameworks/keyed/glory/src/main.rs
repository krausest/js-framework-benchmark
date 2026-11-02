//! Standard table workload using the pinned Glory GitHub runtime.
mod data;
mod model;
use glory::display::*;
use std::cell::RefCell;
fn demo(scope: &Scope) -> impl Widget {
    let model = model::Model::new(scope);
    let row_model = model.clone();
    view! {
        <div class="container">
            <div class="jumbotron"><div class="row">
                <div class="col-md-6"><h1>"Glory"</h1></div>
                <div class="col-md-6"><div class="row">
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="run" on:click={model.handler(0)}>"Create 1,000 rows"</button></div>
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="runlots" on:click={model.handler(1)}>"Create 10,000 rows"</button></div>
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="add" on:click={model.handler(2)}>"Append 1,000 rows"</button></div>
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="update" on:click={model.handler(3)}>"Update every 10th row"</button></div>
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="clear" on:click={model.handler(4)}>"Clear"</button></div>
                    <div class="col-sm-6 smallpad"><button type="button" class="btn btn-primary btn-block" id="swaprows" on:click={model.handler(5)}>"Swap Rows"</button></div>
                </div></div>
            </div></div>
            <table class="table table-hover table-striped test-data"><tbody id="tbody">
                <Each each={model.rows} children={move |row| {
                    let id=*row.key();let label=field!(row.label);
                    view! {
                        <tr class:danger={computed(row_model.is_selected(id))}>
                            <td class="col-md-1">{id}</td>
                            <td class="col-md-4"><a on:click={row_model.select(id)}>{label}</a></td>
                            <td class="col-md-1"><a on:click={row_model.remove(id)}><span class="glyphicon glyphicon-remove" aria-hidden="true"/></a></td>
                            <td class="col-md-6"/>
                        </tr>
                    }
                }}/>
            </tbody></table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
        </div>
    }
}
thread_local! {static APP:RefCell<Option<App>>=const{RefCell::new(None)};}
fn main() {
    let app = App::at_id("main").unwrap();
    app.render(demo(&app.scope())).unwrap();
    APP.with(|slot| *slot.borrow_mut() = Some(app));
}
