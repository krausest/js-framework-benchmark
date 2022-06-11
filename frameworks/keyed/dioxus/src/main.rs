#![allow(non_snake_case)]

use dioxus::prelude::*;
use rand::prelude::*;

fn main() {
    // for performance reasons, we want to cache these strings on the edge of js/rust boundary
    for &name in ADJECTIVES
        .iter()
        .chain(NOUNS.iter())
        .chain(COLOURS.iter())
        .chain(OTHER.iter())
    {
        wasm_bindgen::intern(name);
    }    
    
    dioxus::web::launch(app);
}

fn app1(cx: Scope) -> Element {
    cx.render(rsx!{
        div { "hello, wasm!" }
    })
}

#[derive(Clone, PartialEq)]
struct Label {
    key: usize,
    labels: Vec<&'static str>,
}

impl Label {
    fn new_list(num: usize, key_from: usize) -> Vec<Self> {
        let mut rng = SmallRng::from_entropy();
        let mut labels = Vec::with_capacity(num);
        for x in 0..num {
            labels.push(Label {
                key: x as usize + key_from,
                labels: vec![
                    *ADJECTIVES.choose(&mut rng).unwrap(),
                    *COLOURS.choose(&mut rng).unwrap(),
                    *NOUNS.choose(&mut rng).unwrap(),
                ],
            });
        }
        labels
    }
}

#[derive(Clone, PartialEq)]
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
        self.labels.extend(Label::new_list(1_000, self.last_key + 1));
        self.last_key += num;
    }

    fn overwrite(&mut self, num: usize) {
        self.labels = Label::new_list(num, self.last_key + 1);
        self.last_key += num;
    }

    fn swap(&mut self, a: usize, b: usize) {
        if self.labels.len() > a + 1 && self.labels.len() > b {
            self.labels.swap(a, b);
        }
    }

    #[feature(int_roundings)]
    fn remove(&mut self, index: usize) {
        self.labels.remove(index as usize);
    }

}

fn app(cx: Scope) -> Element {
    let labels_container = use_ref(&cx, || LabelsContainer::new(0, 0));
    let selected: &UseState<Option<usize>> = use_state(&cx, || None);

    cx.render(rsx! {
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
                                onclick: move |_| labels_container.write().labels.iter_mut().step_by(10).for_each(|item| item.labels.push("!!!")),
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
                    labels_container.read().labels.iter().enumerate().map(|(index, item)| {
                        let key = item.key;
                        let is_in_danger = if (*selected).map(|s| s == item.key).unwrap_or(false) {"danger"} else {""};
                        rsx!(tr { key: "{key}", class: "{is_in_danger}",
                            td { class:"col-md-1", "{key}" }
                            td { class:"col-md-4", onclick: move |_| selected.set(Some(key)),
                                a { class: "lbl", [item.labels.join(" ").as_str()] }
                            }
                            td { class: "col-md-1",
                                a { class: "remove", onclick: move |_| { labels_container.write().remove(index); },
                                    span { class: "glyphicon glyphicon-remove remove", aria_hidden: "true" }
                                }
                            }
                            td { class: "col-md-6" }
                        })
                    })
                }
             }
            span { class: "preloadicon glyphicon glyphicon-remove", aria_hidden: "true" }
        }
    })
}

#[derive(Props)]
struct ActionButtonProps<'a> {
    name: &'a str,
    id: &'a str,
    onclick: EventHandler<'a>,
}

fn ActionButton<'a>(cx: Scope<'a, ActionButtonProps<'a>>) -> Element {
    cx.render(rsx! {
        div {
            class: "col-sm-6 smallpad",
            button {
                class:"btn btn-primary btn-block",
                r#type: "button",
                id: "{cx.props.id}",
                onclick: move |_| cx.props.onclick.call(()),

                "{cx.props.name}"
            }
        }
    })
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
