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
    label: Signal<String>,
}

impl Label {
    fn new(num: usize, label: String) -> Self {
        Label {
            id: num,
            label: use_signal(|| label),
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
        let mut label = String::with_capacity(adjective.len() + colour.len() + noun.len() + 2);
        label.push_str(adjective);
        label.push(' ');
        label.push_str(colour);
        label.push(' ');
        label.push_str(noun);
        list.push(Label::new(x + key_from, label));
    }
}

#[derive(Props, Clone, PartialEq)]
struct LabelsContainer {
    last_key: usize,
    labels: Vec<Label>,
}

impl LabelsContainer {
    fn new(num: usize, last_key: usize) -> LabelsContainer {
        let labels = Label::new_list(num, last_key + 1);
        LabelsContainer {
            labels,
            last_key: last_key + num,
        }
    }

    fn append(&mut self, num: usize) {
        self.labels.reserve(num);
        append(&mut self.labels, num, self.last_key + 1);
        self.last_key += num;
    }

    fn overwrite(&mut self, num: usize) {
        self.labels.clear();
        append(&mut self.labels, num, self.last_key + 1);
        self.last_key += num;
    }

    fn swap(&mut self, a: usize, b: usize) {
        if self.labels.len() > a + 1 && self.labels.len() > b {
            self.labels.swap(a, b);
        }
    }

    fn remove(&mut self, key: usize) {
        if let Some(to_remove) = self.labels.iter().position(|x| x.id == key) {
            self.labels.remove(to_remove);
        }
    }
}

#[component]
fn app() -> Element {
    let mut labels_container = use_signal(|| LabelsContainer::new(0, 0));
    let selected: Signal<Option<usize>> = use_signal(|| None);

    rsx! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6", h1 { "Dioxus" } }
                    div { class: "col-md-6",
                        div { class: "row",
                            ActionButton { name: "Create 1,000 rows", id: "run",
                                onclick: move |_| labels_container.write().overwrite(1_000),
                            }
                            ActionButton { name: "Create 10,000 rows", id: "runlots",
                                onclick: move |_| labels_container.write().overwrite(10_000),
                            }
                            ActionButton { name: "Append 1,000 rows", id: "add",
                                onclick: move |_| labels_container.write().append(1_000),
                            }
                            ActionButton { name: "Update every 10th row", id: "update",
                                onclick: move |_| {
                                    let mut labels = labels_container.write();
                                    for i in 0..(labels.labels.len()/10) {
                                        *labels.labels[i*10].label.write() += " !!!";
                                    }
                                },
                            }
                            ActionButton { name: "Clear", id: "clear",
                                onclick: move |_| labels_container.write().overwrite(0),
                            }
                            ActionButton { name: "Swap rows", id: "swaprows",
                                onclick: move |_| labels_container.write().swap(1, 998),
                            }
                        }
                    }
                }
            }

            table { class: "table table-hover table-striped test-data",
                tbody { id: "tbody",
                    {labels_container.read().labels.iter().map(|item| {
                        rsx! {
                            Row {
                                label: item.clone(),
                                labels: labels_container.clone(),
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
struct RowProps {
    label: Label,
    labels: Signal<LabelsContainer>,
    selected_row: Signal<Option<usize>>,
}

impl PartialEq for RowProps {
    fn eq(&self, other: &Self) -> bool {
        self.label == other.label
    }
}

#[component]
fn Row(mut props: RowProps) -> Element {
    let label_text = use_memo(move || props.label.label.clone());
    let id = props.label.id;
    let is_in_danger = use_memo(move || {
        let result = match props.selected_row.read().as_ref() {
            Some(selected_row) => {
                if *selected_row == id {
                    "danger"
                } else {
                    ""
                }
            }
            None => "",
        };
        result
    });

    rsx! {
        tr { class: is_in_danger,
            td { class:"col-md-1", "{props.label.id}" }
            td { class:"col-md-4", onclick: move |_| {
                    *props.selected_row.write() = Some(props.label.id)
                },
                a { class: "lbl", "{label_text}" }
            }
            td { class: "col-md-1",
                a { class: "remove", onclick: move |_| props.labels.write().remove(props.label.id),
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
