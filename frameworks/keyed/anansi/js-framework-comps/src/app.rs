use std::sync::atomic::{AtomicUsize, Ordering};
use rand::prelude::*;
use anansi_aux::prelude::*;

static ADJECTIVES: &[&str] = &[
    "pretty", "large", "big", "small", "tall", "short", "long", "handsome",
    "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful",
    "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy",
];

static COLOURS: &[&str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown",
    "white", "black", "orange",
];

static NOUNS: &[&str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie",
    "sandwich", "burger", "pizza", "mouse", "keyboard",
];

#[refchild]
#[derive(Serialize, Deserialize, Debug)]
struct RowData {
    id: usize,
    label: String,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn append_data(data: &mut RefVec<RowData>, count: usize) {
    let mut thread_rng = thread_rng();

    for _ in 0..count {
        let adjective = ADJECTIVES.choose(&mut thread_rng).unwrap();
        let colour = COLOURS.choose(&mut thread_rng).unwrap();
        let noun = NOUNS.choose(&mut thread_rng).unwrap();
        let label = format!("{} {} {}", adjective, colour, noun);

        data.push(RowData::child(ID_COUNTER.load(Ordering::Relaxed), label));

        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }
}

fn build_data(data: &mut Signal<RefVec<RowData>>, count: usize) {
    let mut data = data.value_mut();
    data.clear();
    append_data(&mut data, count);
}

#[function_component(App)]
fn init() -> Rsx {
    let mut data = signal!(RefVec<RowData>, RefVec::new());
    let mut selected = signal!(Option<usize>, None);

    rsx!(data, selected, {
        <div class="container">
            <div class="jumbotron"><div class="row">
            <div class="col-md-6"><h1>Anansi</h1></div>
            <div class="col-md-6"><div class="row">
                <div class="col-sm-6 smallpad">
                    <button id="run" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, selected, {
                        build_data(data, 1_000);
                        *selected.value_mut() = None;
                    }))>Create 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button id="runlots" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, selected, {
                        build_data(data, 10_000);
                        *selected.value_mut() = None;
                    }))>Create 10,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button id="add" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, {
                        append_data(&mut data.value_mut(), 1_000);
                    }))>Append 1,000 rows</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button id="update" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, {
                        for mut row in data.value_mut().iter_mut().step_by(10) {
                            row.label_mut().push_str(" !!!");
                        }
                    }))>Update every 10th row</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button id="clear" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, selected, {
                        data.value_mut().clear();
                        *selected.value_mut() = None;
                    }))>Clear</button>
                </div>
                <div class="col-sm-6 smallpad">
                    <button id="swaprows" class="btn btn-primary btn-block" type="button" @onclick(callback!(data, {
                        let value = data.value_mut();
                        if value.len() > 998 {
                            value.swap(1, 998);
                        }
                    }))>Swap Rows</button>
                </div>
            </div></div>
            </div></div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    @keyed row, data.value_mut().iter_mut(), row.id() {
                        <tr class=@if *selected.value() == Some(*row.id()) {
                            @:"danger"
                        } else {
                            @:""
                        }>
                            <td class="col-md-1">@row.id()</td>
                            <td class="col-md-4"><a @onclick(callback!(selected, row, {
                                *selected.value_mut() = Some(*row.id());
                                anansi_aux::log!("{}", selected.value().unwrap());
                            }))>@row.label()</a></td>
                            <td class="col-md-1"><a @onclick(callback!(data, row, {
                                let value = data.value_mut();
                                let id = *row.id();
                                release!(row);
                                let pos = value.iter().position(|r| {*r.id() == id}).expect("problem finding position");
                                value.remove(pos);
                            }))><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                            <td class="col-md-6"/>
                        </tr>
                    }
                </tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
    });
}


