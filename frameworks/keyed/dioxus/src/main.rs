#![allow(non_snake_case)]

use dioxus::prelude::*;
use js_sys::Math;

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

fn main() {
    launch(app);
}

#[derive(PartialEq, Clone, Props)]
struct Label {
    id: usize,
    label: String,
}

impl Label {
    fn new(num: usize, label: String) -> Self {
        Label {
            id: num,
            label
        }
    }

    fn new_list(num: usize, key_from: usize) -> Vec<Self> {
        let mut labels = Vec::with_capacity(num);
        append(&mut labels, num, key_from);
        labels
    }
}

fn append(list: &mut Vec<Label>, num: usize, key_from: usize) {
    list.reserve_exact(num);
    for x in 0..num {
        let adjective = ADJECTIVES[random(ADJECTIVES.len())];
        let colour = COLOURS[random(COLOURS.len())];
        let noun = NOUNS[random(NOUNS.len())];
        let label = format!("{adjective} {colour} {noun}");
        list.push(Label::new(x + key_from, label));
    }
}

#[derive(Props, Clone, PartialEq)]
struct Data {
    last_row_id: usize,
    rows: Vec<Label>,
}

impl Data {
    fn new(num: usize, last_key: usize) -> Data {
        let labels = Label::new_list(num, last_key + 1);
        Data {
            rows: labels,
            last_row_id: last_key + num,
        }
    }

    fn append(&mut self, num: usize) {
        self.rows.reserve(num);
        append(&mut self.rows, num, self.last_row_id + 1);
        self.last_row_id += num;
    }

    fn overwrite(&mut self, num: usize) {
        self.rows.clear();
        append(&mut self.rows, num, self.last_row_id + 1);
        self.last_row_id += num;
    }

    fn swap(&mut self, a: usize, b: usize) {
        if self.rows.len() > a + 1 && self.rows.len() > b {
            self.rows.swap(a, b);
        }
    }

    fn remove(&mut self, key: usize) {
        if let Some(to_remove) = self.rows.iter().position(|x| x.id == key) {
            self.rows.remove(to_remove);
        }
    }
}

#[component]
fn app() -> Element {
    let mut data = use_signal(|| Data::new(0, 0));
    let selected: Signal<Option<usize>> = use_signal(|| None);

    rsx! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6", h1 { "Dioxus" } }
                    div { class: "col-md-6",
                        div { class: "row",
                            ActionButton { name: "Create 1,000 rows", id: "run",
                                onclick: move |_| data.write().overwrite(1_000),
                            }
                            ActionButton { name: "Create 10,000 rows", id: "runlots",
                                onclick: move |_| data.write().overwrite(10_000),
                            }
                            ActionButton { name: "Append 1,000 rows", id: "add",
                                onclick: move |_| data.write().append(1_000),
                            }
                            ActionButton { name: "Update every 10th row", id: "update",
                                onclick: move |_| {
                                    for row in data.write().rows.iter_mut().step_by(10) {
                                        row.label += " !!!";
                                    }
                                },
                            }
                            ActionButton { name: "Clear", id: "clear",
                                onclick: move |_| data.write().overwrite(0),
                            }
                            ActionButton { name: "Swap rows", id: "swaprows",
                                onclick: move |_| data.write().swap(1, 998),
                            }
                        }
                    }
                }
            }

            table { class: "table table-hover table-striped test-data",
                tbody { id: "tbody",
                    {data.read().rows.iter().map(|item| {
                        rsx! {
                            RowComponent {
                                row: item.clone(),
                                data: data.clone(),
                                selected_row: selected.clone(),
                                key: "{item.id}",
                            }
                        }
                    })}
                }
            }

            span { class: "preloadicon glyphicon glyphicon-remove", aria_hidden: "true" }
        }
    }
}

#[derive(Clone, Props)]
struct RowComponentProps {
    row: Label,
    data: Signal<Data>,
    selected_row: Signal<Option<usize>>,
}

impl PartialEq for RowComponentProps {
    fn eq(&self, other: &Self) -> bool {
        self.row == other.row
    }
}

#[component]
fn RowComponent(mut props: RowComponentProps) -> Element {
    let danger_class = match props.selected_row.read().as_ref() {
        Some(selected_row) => {
            if *selected_row == props.row.id {
                "danger"
            } else {
                ""
            }
        }
        None => "",
    };

    rsx! {
        tr { class: danger_class,
            td { class:"col-md-1", "{props.row.id}" }
            td { class:"col-md-4", onclick: move |_| {
                    *props.selected_row.write() = Some(props.row.id)
                },
                a { class: "lbl", "{props.row.label}" }
            }
            td { class: "col-md-1",
                a { class: "remove", onclick: move |_| props.data.write().remove(props.row.id),
                    span { class: "glyphicon glyphicon-remove remove", aria_hidden: "true" }
                }
            }
            td { class: "col-md-6" }
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
