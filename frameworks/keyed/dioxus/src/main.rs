#![allow(non_snake_case)]

use std::sync::atomic::{AtomicUsize, Ordering};

use dioxus::prelude::*;
use js_sys::Math;
use rand::{seq::SliceRandom, thread_rng};

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

fn main() {
    launch(app);
}



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


#[derive(PartialEq, Clone, Props)]
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
            label: use_signal(|| label),
        });

        ID_COUNTER.store(ID_COUNTER.load(Ordering::Relaxed) + 1, Ordering::Relaxed);
    }

    data
}

#[component]
fn app() -> Element {
    let mut data = use_signal(|| Vec::<RowData>::new());
    let mut selected: Signal<Option<usize>> = use_signal(|| None);

    let mut select = move |id: usize| selected.set(Some(id));

    let mut remove = move |id: usize| data.write().retain(|row| row.id != id);

    let mut run = move |_| {
        data.set(build_data(1000));
        selected.set(None);
    };

    let mut run_lots = move |_| {
        data.set(build_data(10000));
        selected.set(None);
    };

    let mut add = move |_| {
        data.set(build_data(1000));
    };

    let mut update = move |_| {
        for row in data.write().iter_mut().step_by(10) {
            row.label.set(format!("{} !!!", row.label.read()));
        }
    };

    let mut clear = move |_| {
        data.set(Vec::new());
        selected.set(None);
    };

    let mut swap_rows = move |_| {
        if data.len() > 998 {
            data.write().swap(1, 998);
        }
    };

    rsx! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6", h1 { "Dioxus" } }
                    div { class: "col-md-6",
                        div { class: "row",
                            ActionButton { name: "Create 1,000 rows", id: "run",
                                onclick: move |_| run(()),
                            }
                            ActionButton { name: "Create 10,000 rows", id: "runlots",
                                onclick: move |_| run_lots(()),
                            }
                            ActionButton { name: "Append 1,000 rows", id: "add",
                                onclick: move|_| add(()),
                            }
                            ActionButton { name: "Update every 10th row", id: "update",
                                onclick: move |_| update(()),
                            }
                            ActionButton { name: "Clear", id: "clear",
                                onclick: move |_| clear(()),
                            }
                            ActionButton { name: "Swap rows", id: "swaprows",
                                onclick:  move|_| swap_rows(()),
                            }
                        }
                    }
                }
            }

            table { class: "table table-hover table-striped test-data",
                tbody { id: "tbody",
                    {
                        data.read().iter().map( |row| {
                        
                            let row_id = row.id;
                            let label = row.label;
                            let is_in_danger = selected.read() == Some(row.id);

                            rsx! {
                                tr { class: if is_in_danger {"danger"},
                                    td { class:"col-md-1", "{row.id}" }
                                    td { class:"col-md-4", onclick: move |_| select(row.id) ,
                                        a { class: "lbl", "{label}" }
                                    }
                                    td { class: "col-md-1",
                                        a { class: "remove", onclick: move |_| remove(row.id),
                                            span { class: "glyphicon glyphicon-remove remove", aria_hidden: "true" }
                                        }
                                    }
                                    td { class: "col-md-6" }
                                }
                            }
                        });
                    }
                }
            }

            span { class: "preloadicon glyphicon glyphicon-remove", aria_hidden: "true" }
        }
    }
}

#[component]
fn ActionButton(name: String, id: String, onclick: EventHandler) -> Element {
    rsx! {
        div {
            class: "col-sm-6 smallpad",
            button {
                class:"btn btn-primary btn-block",
                r#type: "button",
                id: id,
                onclick: move |_| onclick.call(()),
                "{name}",
            }
        }
    }
}