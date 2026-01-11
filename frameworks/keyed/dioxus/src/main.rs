#![allow(non_snake_case)]

use dioxus::prelude::*;
use js_sys::Math;
use std::sync::atomic::{AtomicUsize, Ordering};

fn main() {
    dioxus_web::launch::launch(app, Default::default(), Default::default());
}

#[component]
fn app() -> Element {
    let mut rows = use_signal(|| Vec::<RowData>::new());
    let selected_row: Signal<Option<usize>> = use_signal(|| None);
    let compare_selected = use_set_compare(move || selected_row());

    rsx! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6",
                        h1 { "Dioxus" }
                    }
                    div { class: "col-md-6",
                        div { class: "row",
                            Button {
                                name: "Create 1,000 rows",
                                id: "run",
                                onclick: move |_| {
                                    randomize_rows(rows, 1000);
                                }
                            }
                            Button {
                                name: "Create 10,000 rows",
                                id: "runlots",
                                onclick: move |_| {
                                    randomize_rows(rows, 10000);
                                }
                            }
                            Button {
                                name: "Append 1,000 rows",
                                id: "add",
                                onclick: move |_| {
                                    add_data(&mut rows.write(), 1000);
                                }
                            }
                            Button {
                                name: "Update every 10th row",
                                id: "update",
                                onclick: move |_| {
                                    for row in rows.iter().step_by(10) {
                                        *row.label.write_unchecked() += " !!!";
                                    }
                                }
                            }
                            Button {
                                name: "Clear",
                                id: "clear",
                                onclick: move |_| {
                                    rows.clear();
                                }
                            }
                            Button {
                                name: "Swap rows",
                                id: "swaprows",
                                onclick: move |_| {
                                    if rows.len() > 998 {
                                        rows.write().swap(1, 998);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            table { class: "table table-hover table-striped test-data",
                tbody { id: "tbody",
                    for row in rows.iter() {
                        Row {
                            key: "{row.id}",
                            id: row.id,
                            label: row.label,
                            rows,
                            compare_selected,
                            selected_row
                        }
                    }
                }
            }
        }
    }
}

#[component]
fn Row(
    rows: Signal<Vec<RowData>>,
    id: usize,
    label: Signal<String>,
    compare_selected: SetCompare<Option<usize>>,
    mut selected_row: Signal<Option<usize>>,
) -> Element {
    use_drop(move || {
        label.manually_drop();
    });
    let selected = use_set_compare_equal(Some(id), compare_selected);
    rsx! {
        tr { class: if selected() { "danger" },
            td { class: "col-md-1", "{id}" }
            td {
                class: "col-md-4",
                onclick: move |_| selected_row.set(Some(id)),
                a { class: "lbl", {label} }
            }
            td { class: "col-md-1",
                a {
                    class: "remove",
                    onclick: move |_| rows.write().retain(|other_row| other_row.id != id),
                    span {
                        class: "glyphicon glyphicon-remove remove",
                        aria_hidden: "true"
                    }
                }
            }
            td { class: "col-md-6" }
        }
    }
}

#[component]
fn Button(name: String, id: String, onclick: EventHandler) -> Element {
    rsx! {
        div { class: "col-sm-6 smallpad",
            button {
                class: "btn btn-primary btn-block",
                r#type: "button",
                id,
                onclick: move |_| onclick(()),
                "{name}"
            }
        }
    }
}

#[derive(PartialEq, Clone, Copy)]
struct RowData {
    id: usize,
    label: Signal<String>,
}

static ID_COUNTER: AtomicUsize = AtomicUsize::new(1);

fn randomize_rows(mut rows: Signal<Vec<RowData>>, count: usize) {
    let mut write = rows.write();
    write.clear();
    add_data(&mut write, count);
}

fn add_data(rows: &mut Vec<RowData>, count: usize) {
    rows.reserve_exact(count);

    for _i in 0..count {
        let adjective = select_random(ADJECTIVES);
        let colour = select_random(COLOURS);
        let noun = select_random(NOUNS);
        let capacity = adjective.len() + colour.len() + noun.len() + 2;
        let mut label = String::with_capacity(capacity);
        label.push_str(adjective);
        label.push(' ');
        label.push_str(colour);
        label.push(' ');
        label.push_str(noun);

        rows.push(RowData {
            id: ID_COUNTER.fetch_add(1, Ordering::Relaxed),
            label: Signal::new(label),
        });
    }
}

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

fn select_random<'a>(data: &'a [&'a str]) -> &'a str {
    let index = random(data.len());
    data[index]
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
