use std::sync::atomic::{AtomicUsize, Ordering};

use rand::prelude::*;
use sycamore::prelude::*;
use wasm_bindgen::prelude::*;
use web_sys::window;

static ADJECTIVES: &[&str] = &[
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
];

static COLOURS: &[&str] = &[
    "red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black",
    "orange",
];

static NOUNS: &[&str] = &[
    "table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger",
    "pizza", "mouse", "keyboard",
];

struct ButtonProps {
    id: &'static str,
    text: &'static str,
    callback: Box<dyn Fn()>,
}

#[component(Button<G>)]
fn button(props: ButtonProps) -> View<G> {
    let ButtonProps { id, text, callback } = props;

    view! {
        div(class="col-sm-6 smallpad") {
            button(id=id, class="btn btn-primary btn-block", type="button", on:click=move |_| callback()) {
                (text)
            }
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct RowData {
    id: usize,
    label: Signal<String>,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn build_data(count: usize) -> Vec<RowData> {
    let mut thread_rng = thread_rng();

    let mut data = Vec::new();
    data.reserve_exact(count);

    for _i in 0..count {
        let adjective = ADJECTIVES.choose(&mut thread_rng).unwrap();
        let colour = COLOURS.choose(&mut thread_rng).unwrap();
        let noun = NOUNS.choose(&mut thread_rng).unwrap();
        let capacity = adjective.len() + colour.len() + noun.len() + 2;
        let mut label = String::with_capacity(capacity);
        label.push_str(adjective);
        label.push(' ');
        label.push_str(colour);
        label.push(' ');
        label.push_str(noun);

        data.push(RowData {
            id: ID_COUNTER.load(Ordering::Relaxed),
            label: Signal::new(label),
        });

        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }

    data
}

#[component(App<G>)]
fn app() -> View<G> {
    let data = Signal::new(Vec::<RowData>::new());
    let selected = Signal::new(None::<usize>);

    let remove = cloned!((data) => move |id| {
        data.set(data.get().iter().filter(|row| row.id != id).cloned().collect());
    });

    let run = cloned!((data, selected) => move || {
        data.set(build_data(1000));
        selected.set(None);
    });

    let runlots = cloned!((data, selected) => move || {
        data.set(build_data(10000));
        selected.set(None);
    });

    let add = cloned!((data) => move || {
        data.set(data.get().iter().cloned().chain(build_data(1000)).collect());
    });

    let update = cloned!((data) => move || {
        let mut tmp = (*data.get()).clone();
        for row in tmp.iter_mut().step_by(10) {
            row.label.set(format!("{} !!!", row.label.get()));
        }
        data.set(tmp);
    });

    let clear = cloned!((data, selected) => move || {
        data.set(Vec::new());
        selected.set(None);
    });

    let swaprows = cloned!((data) => move || {
        let mut d = (*data.get()).clone();
        if d.len() > 998 {
            d.swap(1, 998);
        }
        data.set(d);
    });

    view! {
        div(class="container") {
            div(class="jumbotron") {
                div(class="row") {
                    div(class="col-md-6") { h1 { "Sycamore Keyed" } }
                    div(class="col-md-6") {
                        div(class="row") {
                            Button(ButtonProps { id: "run", text: "Create 1,000 rows", callback: Box::new(run) })
                            Button(ButtonProps { id: "runlots", text: "Create 10,000 rows", callback: Box::new(runlots) })
                            Button(ButtonProps { id: "add", text: "Append 1,000 rows", callback: Box::new(add) })
                            Button(ButtonProps { id: "update", text: "Update every 10th row", callback: Box::new(update) })
                            Button(ButtonProps { id: "clear", text: "Clear", callback: Box::new(clear) })
                            Button(ButtonProps { id: "swaprows", text: "Swap Rows", callback: Box::new(swaprows) })
                        }
                    }
                }
            }
            table(class="table table-hover table-striped test-data") {
                tbody {
                    Keyed(KeyedProps {
                        iterable: data.handle(),
                        template: move |row| {
                            let row_id = row.id;
                            let is_selected = create_selector(cloned!((selected) => move || *selected.get() == Some(row_id)));
                            cloned!((selected, remove) => view! {
                                tr(class=if *is_selected.get() { "danger" } else { "" }) {
                                    td(class="col-md-1") { (row_id) }
                                    td(class="col-md-4") {
                                        a(on:click=move |_| selected.set(Some(row_id))) { (row.label.get()) }
                                    }
                                    td(class="col-md-1") {
                                        a(on:click=move |_| remove(row_id)) {
                                            span(class="glyphicon glyphicon-remove", aria-hidden="true")
                                        }
                                    }
                                    td(class="col-md-6")
                                }
                            })
                        },
                        key: |row| row.id
                    })
                }
            }
        }
    }
}

#[wasm_bindgen(start)]
pub fn start() {
    let document = window().unwrap().document().unwrap();
    let mount_el = document.query_selector("#main").unwrap().unwrap();
    sycamore::render_to(|| view! { App() }, &mount_el);
}
