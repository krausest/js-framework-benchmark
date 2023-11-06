#![allow(non_snake_case)]

use dioxus::prelude::*;
use js_sys::Math;

fn random(max: usize) -> usize {
    (Math::random() * 1000.0) as usize % max
}

fn main() {
    dioxus_web::launch(app);
}

#[derive(Clone, PartialEq)]
struct Label {
    key: usize,
    label: Tracked<String>,
}

impl Label {
    fn new(cx: &ScopeState, num: usize, label: String) -> Self {
        Label {
            key: num,
            label: Tracked::new(cx, label),
        }
    }

    fn new_list(cx: &ScopeState, num: usize, key_from: usize) -> Vec<Self> {
        let mut labels = Vec::with_capacity(num);
        append(cx, &mut labels, num, key_from);
        labels
    }
}

fn append(cx: &ScopeState,list: &mut Vec<Label>, num: usize, key_from: usize) {
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
        list.push(Label::new(cx, x + key_from, label));
    }
}

#[derive(Clone, PartialEq)]
struct LabelsContainer {
    last_key: usize,
    labels: Vec<Label>,
}

impl LabelsContainer {
    fn new(cx: &ScopeState,num: usize, last_key: usize) -> LabelsContainer {
        let labels = Label::new_list(cx, num, last_key + 1);
        LabelsContainer {
            labels,
            last_key: last_key + num,
        }
    }

    fn append(&mut self, cx: &ScopeState,num: usize) {
        self.labels.reserve(num);
        append(cx, &mut self.labels, num, self.last_key + 1);
        self.last_key += num;
    }

    fn overwrite(&mut self,cx: &ScopeState,  num: usize) {
        self.labels.clear();
        append(cx, &mut self.labels, num, self.last_key + 1);
        self.last_key += num;
    }

    fn swap(&mut self, a: usize, b: usize) {
        if self.labels.len() > a + 1 && self.labels.len() > b {
            self.labels.swap(a, b);
        }
    }

    fn remove(&mut self, key: usize) {
        if let Some(to_remove) = self.labels.iter().position(|x| x.key == key) {
            self.labels.remove(to_remove);
        }
    }
}

fn app(cx: Scope) -> Element {
    let labels_container = use_ref(&cx, || LabelsContainer::new(cx, 0, 0));
    let selected: &Tracked<Option<usize>> = cx.use_hook(||{
        Tracked::new(&cx, None)
    });

    render! {
        div { class: "container",
            div { class: "jumbotron",
                div { class: "row",
                    div { class: "col-md-6", h1 { "Dioxus" } }
                    div { class: "col-md-6",
                        div { class: "row",
                            ActionButton { name: "Create 1,000 rows", id: "run",
                                onclick: move |_| labels_container.write().overwrite(cx, 1_000),
                            }
                            ActionButton { name: "Create 10,000 rows", id: "runlots",
                                onclick: move |_| labels_container.write().overwrite(cx, 10_000),
                            }
                            ActionButton { name: "Append 1,000 rows", id: "add",
                                onclick: move |_| labels_container.write().append(cx, 1_000),
                            }
                            ActionButton { name: "Update every 10th row", id: "update",
                                onclick: move |_| {
                                    let labels = labels_container.read();
                                    for i in 0..(labels.labels.len()/10) {
                                        *labels.labels[i*10].label.write() += " !!!";
                                    }
                                },
                            }
                            ActionButton { name: "Clear", id: "clear",
                                onclick: move |_| labels_container.write().overwrite(cx, 0),
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
                    labels_container.read().labels.iter().map(|item| {
                        rsx! {
                            Row {
                                label: item.clone(),
                                labels: labels_container.clone(),
                                selected_row: selected.clone(),
                                key: "{item.key}"
                            }
                        }
                    })
                }
            }

            span { class: "preloadicon glyphicon glyphicon-remove", aria_hidden: "true" }
        }
    }
}

#[derive(Props)]
struct RowProps {
    label: Label,
    labels: UseRef<LabelsContainer>,
    selected_row: Tracked<Option<usize>>,
}

impl PartialEq for RowProps {
    fn eq(&self, other: &Self) -> bool {
        self.label == other.label
    }
}

fn Row(cx: Scope<RowProps>) -> Element {
    let RowProps {
        label,
        labels,
        selected_row,
    } = &cx.props;
    let label_text = use_selector(&cx, &label.label, |label| label.clone());
    let key = label.key;
    let is_in_danger = use_selector(&cx, selected_row, move |selected_row: &Option<usize>| {
        let result = match selected_row {
            Some(selected_row) => {
                if *selected_row == key {
                    "danger"
                } else {
                    ""
                }
            }
            None => "",
        };
        result
    });

    render! {
        tr { class: is_in_danger,
            td { class:"col-md-1", "{label.key}" }
            td { class:"col-md-4", onclick: move |_| {
                    *selected_row.write() = Some(label.key)
                },
                a { class: "lbl", "{label_text}" }
            }
            td { class: "col-md-1",
                a { class: "remove", onclick: move |_| labels.write().remove(label.key),
                    span { class: "glyphicon glyphicon-remove remove", aria_hidden: "true" }
                }
            }
            td { class: "col-md-6" }
        }
    }
}

#[inline_props]
fn ActionButton<'a>(
    cx: Scope<'a, ActionButtonProps>,
    name: &'static str,
    id: &'static str,
    onclick: EventHandler<'a>,
) -> Element {
    render! {
        div {
            class: "col-sm-6 smallpad",
            button {
                class:"btn btn-primary btn-block",
                r#type: "button",
                id: *id,
                onclick: move |_| onclick.call(()),
                *name
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
